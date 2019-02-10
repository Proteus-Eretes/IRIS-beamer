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
    }

    async getLastResults() {
        const data = await this._updateLastResults();
        return data.regatta;
    }

    async update() {
        const data = await this._update();
        return data.regatta;
    }

    /**
     * @private
     */
    _update() {
        return this._fetch(`/beamer/getRegattaData/${this.regattaId}/${this.presetId}`);
    }

    _updateLastResults() {
        return this._fetch(`/beamer/getLastResults/${this.regattaId}/${this.presetId}`);
    }

    getNextPage(blocks) {
        this.beginCount = this.endCount;
        this.endCount += 20;
        this.fields = [];
        let count = 0;
        let fieldCount = 0;
        blocks = blocks.map(block => {
            block = block.map((field) => {
                field.crews.teams = field.crews.teams.filter(team => {
                    return team.times.length > 0;
                });
                field.crewCount = field.crews.teams.length;
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
                    console.log(`Count: ${count} begin: ${this.beginCount} end: ${this.endCount}: crew ${field.crewCount}`);
                    if (2 * fieldCount + count > this.endCount) {
                        field.crews.teams.length = 0;
                    }
                    if (count < this.beginCount) {
                        if (count + field.crewCount > this.beginCount) {
                            field.crews.teams.splice(0, this.beginCount - count);
                        } else {
                            field.crews.teams.length = 0;
                        }

                    }
                    if (count + field.crews.teams.length + 2 * fieldCount> this.endCount) {
                        field.crews.teams.length = Math.max(0, this.endCount - count - 1 - 2 * fieldCount);
                    }

                    count += field.crewCount;
                    if (field.crews.teams.length) {
                        fieldCount++;
                    }
                });
                this.endCount -= 2 * fieldCount;
                if (fieldCount > 1) {
                    this.endCount++;
                }
                this.fields[this.fields.length - 1] = this.fields[this.fields.length - 1].filter(field => {
                    return field.crews.teams.length > 0;
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
