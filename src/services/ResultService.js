import {Service} from "./Service";

export class ResultService extends Service {

    /**
     * @inheritDoc
     * @param {string} regattaId
     * @param {string} presetId
     */
    constructor(key, baseUrl, regattaId, presetId) {
        super(key, baseUrl);
        this.regattaId = regattaId;
        this.presetId = presetId;
        this.fields = [];
        this.beginCount = 0;
        this.endCount = 0;
        this.regatta = null;
        this.lastReults = null;
        this._fieldIndex = null;
        this._blockIndex = null;
        this.blocks = null;
    }

    /**
     * @throws Error
     * @return {Promise<null|*>}
     */
    async getUpdatedLastResults() {
        const data = await this._updateLastResults();
        this.lastReults = data.regatta;
        return this.lastReults;
    }

    getLastResults() {
        return this.lastReults;
    }


    /**
     * @throws Error
     * @return {Promise<null|*|{}|props.regatta|regatta>}
     */
    async update() {
        if (this.regatta === null) {
            const regatta = await this._initRegatta();
            this.regatta = JSON.stringify(regatta.regatta);
            this.blocks = JSON.parse(JSON.stringify(regatta.regatta));
            this._blockIndex = 0;
            this._fieldIndex = 0;
        }
        const data = await this._update();
        const regattaData = JSON.parse(this.regatta);
        regattaData[this._blockIndex][this._fieldIndex].crews = data.field;
        this.regatta = JSON.stringify(regattaData);
        if (++this._fieldIndex === this.blocks[this._blockIndex].length) {
            this._fieldIndex = 0;
            if (++this._blockIndex === this.blocks.length) {
                this._blockIndex = 0;
            }
        }
        return regattaData;
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
        blocks = blocks.map(block => {
            block = block.map((field) => {
                if (field.crews) {
                    field.crewCount = field.crews.teams.length;
                } else {
                    field.crewCount = 0;
                }
                return field;
            });
            block.crewCount = block.reduce((sum, field) => {
                return sum + field.crewCount;
            }, 0);
            return block;
        });
        blocks.forEach((block) => {
            if (count + block.crewCount > this.beginCount && count < this.endCount) {
                this.fields.push(block);
                this.fields[this.fields.length - 1].forEach(field => {
                    if (fieldCount + count > this.endCount) {
                        field.crews.teams.length = 0;
                    }
                    if (count < this.beginCount) {
                        if (count + field.crewCount > this.beginCount) {
                            field.crews.teams.splice(0, this.beginCount - count);
                        } else {
                            field.crews.teams.length = 0;
                        }
                    }
                    if (count + field.crewCount + fieldCount > this.endCount) {
                        field.crews.teams.length = Math.max(0, this.endCount - count - 1 - fieldCount);
                    }

                    count += field.crewCount;
                    if (field.crewCount) {
                        fieldCount++;
                    }
                });
                this.endCount -= fieldCount;
                this.fields[this.fields.length - 1] = this.fields[this.fields.length - 1].filter(field => {
                    return field.crewCount;
                });
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
