export class BeamerSettings {

    /**
     * @param {string} name
     */
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.preset = null;
    }


    async getBeamerPreset() {
        if (this.preset === null) {
            this.preset = await this._getPreset();
        }

        return this.preset;
    }

    _getPreset() {
        return fetch(this.baseUrl + '/beamer/getPreset/' + this.name)
            .then(response => {
                if (response.status !== 200) {
                    return null;
                }
                return response.json();
            });
    }
}

