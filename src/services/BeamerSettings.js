import { Service } from './Service';

export class BeamerSettings extends Service {
  /**
     * @inheritDoc
     * @param {string} name - The name of preset which we are looking at.
     */
  constructor(key, baseUrl, name) {
    super(key, baseUrl);
    this.name = name;
    this.preset = null;
    this.regatta = null;
  }


  async getBeamerPreset() {
    if (this.preset === null) {
      await this._init();
    }

    return this.preset;
  }

  async getRegattaInformation() {
    if (this.regatta === null) {
      await this._init();
    }

    return this.regatta;
  }

  async _init() {
    const data = await this._getPreset();
    this.preset = data.preset;
    this.regatta = data.regatta;
  }

  _getPreset() {
    return this._fetch(`/beamer/getPreset/${this.name}`);
  }
}
