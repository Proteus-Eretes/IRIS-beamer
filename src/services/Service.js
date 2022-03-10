export class Service {
  /**
     * @param {string} key - Key to use in api call.
     * @param {string} baseUrl - Url where the IRIS system is running.
     */
  constructor(key, baseUrl) {
    this._baseUrl = baseUrl;
    this._key = key;
  }

  /**
     * @param {string} url to fetch url
     * @protected
     */
  _fetch(url) {
    return fetch(this._baseUrl + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: this._key }),
    })
      .then((response) => {
        if (response.status !== 200) {
          return null;
        }
        return response.json();
      });
  }
}
