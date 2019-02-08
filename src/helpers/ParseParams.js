

export class ParseParams {

    /**
     * @param {string} url
     */
    constructor(url) {
        this.url = new URL(url);
    }

    getKey() {
        return this.url.searchParams.get('key');
    }

    getUrl() {
        return this.url.searchParams.get('apiUrl') ? this.url.searchParams.get('apiUrl') : 'https://iris.powredbyiris.nl';
    }
}
