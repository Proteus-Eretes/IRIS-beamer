import { Service } from './Service';
import moment from "moment";

export class ResultService extends Service {
  /**
	 * @inheritDoc
	 * @param {string} regattaId
	 * @param {string} presetId
	 */
  constructor(key, baseUrl, regattaId, presetId, panelType) {
    super(key, baseUrl);
    this.regattaId = regattaId;
    this.presetId = presetId;
    this.fields = [];
    this.beginCount = 0;
    this.endCount = 0;
    this.regatta = null;
    this.lastResults = null;
    this._fieldIndex = null;
    this._blockIndex = null;
    this.blocks = null;
    this.panelType = panelType;
  }

  /**
	 * @throws Error
	 * @return {Promise<null|*>}
	 */
  async getUpdatedLastResults() {
    const data = await this._updateLastResults();
    this.lastResults = data.regatta;
    return this.lastResults;
  }

  getLastResults() {
    return this.lastResults;
  }


  /**
	 * @throws Error
	 * @return {Promise<null|*|{}|props.regatta|regatta>}
	 */
  async update() {
    if (this.regatta === null) {
      const regatta = await this._initRegatta();
      const r = JSON.parse(JSON.stringify(regatta.regatta));
      this.regatta = JSON.stringify(regatta.regatta);
      this.blocks = r;
      this._current_day_block_ids = r
        .map((block, idx) => ({
          id: block[0].blockid,
          block_index: idx,
          today: moment(block[0].daydate).isSame(moment(), 'd'),
          block_num: block[0].blocknumber,
          startTime: moment(`${block[0].daydate} ${block[0].starttime}`).unix(),
        }));
      this._blockIndex = 0;
      this._fieldIndex = 0;
      if (this.panelType === 'day') {
        this._blockIndex = this._current_day_block_ids.findIndex((block) => block.today);
      }
      if (this.panelType === 'block') {
        this._get_last_started_block();
      }
    }
    const data = await this._update();
    const regattaData = JSON.parse(this.regatta);
    regattaData[this._blockIndex][this._fieldIndex].crews = data.field;
    this.regatta = JSON.stringify(regattaData);
    if (++this._fieldIndex === this.blocks[this._blockIndex].length) {
      this._fieldIndex = 0;
      if (this.panelType === 'day') {
        do {
          this._get_next_block_idx();
        } while (!this._current_day_block_ids[this._blockIndex].today);
      } else if (this.panelType === 'block')  {
        this._get_last_started_block();
      } else {
        if (++this._blockIndex === this.blocks.length) {
          this._blockIndex = 0;
        }
      }
    }
    return regattaData;
  }

  _get_next_block_idx() {
    if (++this._blockIndex === this.blocks.length) {
      this._blockIndex = this._current_day_block_ids.findIndex((block) => block.today);
    }
  }

  _get_last_started_block() {
    const data = this._current_day_block_ids.map((block, idx) => ({
      block_index: idx,
      block_num: block.block_num,
      time_since_stared: moment().unix() - block.startTime,
    }));
    data.sort((a, b) => a.time_since_stared - b.time_since_stared);
    this._blockIndex = data[0].block_index;
  }

  getLastRegattaData() {
    return JSON.parse(this.regatta);
  }

  _initRegatta() {
    return this._fetch(`/beamer/getRegattaData/${this.regattaId}/${this.presetId}`);
  }

  /**
	 * @private
	 */
  _update() {
    const fieldCode = this.blocks[this._blockIndex][this._fieldIndex].fieldnameshort;
    return this._fetch(`/beamer/getField/${this.regattaId}/${this.presetId}/${fieldCode.replace(/\+/g, '%2B')}`);
  }

  _updateLastResults() {
    return this._fetch(`/beamer/getLastResults/${this.regattaId}/${this.presetId}`);
  }

  getNextPage(blocks, rows) {
    this.beginCount = this.endCount;
    this.endCount += rows;
    this.fields = [];
    let count = 0;
    let fieldCount = 0;
    // Count amount of crews in a field
    blocks = blocks.map((block) => {
      block = block.map((field) => {
        if (field.crews) {
          field.crewCount = field.crews.teams.length;
        } else {
          field.crewCount = 0;
        }
        return field;
      });
      block.crewCount = block.reduce((sum, field) => sum + field.crewCount, 0);
      return block;
    });
    blocks.forEach((block) => {
      if (count + block.crewCount > this.beginCount && count < this.endCount) {
        this.fields.push(block);
        this.fields[this.fields.length - 1].forEach((field) => {
          if (count < this.beginCount) {
            if (count + field.crewCount > this.beginCount) { // Have to start halfway in this field
              field.crews.teams.splice(0, this.beginCount - count); //Remove crews from start if field is shown on previous page.
            } else if (field.crewCount) { // Already shown this field so don't show it again
              count += field.crewCount;
              field.crews.teams.length = 0;
              field.crewCount = 0;
            }
          }
          if ((count + fieldCount > this.endCount) && field.crewCount) { // These fields will not fit so reduce the count by one
						fieldCount--;
          }
          count += field.crewCount;
          if (field.crewCount) {
            fieldCount++;
          }
        });
        this.endCount -= fieldCount;
        // returns 0 if field is already shown to avoid header shown twice
        this.fields[this.fields.length - 1] = this.fields[this.fields.length - 1].filter(field => field.crewCount);
      } else {
        count += block.crewCount;
      }
    });

    if (count < this.endCount) {
      this.endCount = 0;
    }
    return this.fields;
  }
}
