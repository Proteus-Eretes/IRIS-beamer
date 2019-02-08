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
        this.data = null;
    }

    async getData() {
        if (!this.data) {
            const data = await this._update();
            this.data = data.regatta;
        }

        return this.data;
    }

    async update() {
        const data = await this._update();
        this.data = data.regatta;
        return this.data;
    }

    /**
     * @private
     */
    _update() {
        return this._fetch(`/beamer/getRegattaData/${this.regattaId}/${this.presetId}`);
    }
}
