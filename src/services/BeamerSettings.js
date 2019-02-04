export class BeamerSettings {

    /**
     * @param {string} name - The name of preset which we are looking at.
     * @param {string} baseUrl - Url where the IRIS system is running.
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
        return fetch(this.baseUrl + '/beamer/getPreset/' + this.name, {
            'method': 'POST'
        })
            .then(response => {
                if (response.status !== 200) {
                    return null;
                }
                return response.json();
            })
          .then(data => {
            return data.preset;
          });
    }
}

