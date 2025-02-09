import https from 'https';

/**
 * Request a URL and return the response body.
 * Inspired by https://gist.github.com/ktheory/df3440b01d4b9d3197180d5254d7fb65#file-httppromise-js
 *
 * @param {string} url URL to open
 * @returns {string} Response body
 */
const request = async (url) => new Promise((resolve, reject) => {
  const req = https.request(url, (res) => {
    const chunks = [];
    res.on('error', reject);
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => {
      const body = chunks.join('');
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        resolve(body);
      } else {
        reject(new Error(`Request failed. status: ${res.statusCode}, body: ${res.body}`));
      }
    })
  })
  req.on('error', reject);
  req.end();
});

/**
 * HTTP Error response.
 *
 * @returns {object} 400 Bad Request response
 */
const BAD_REQUEST = () => ({
  statusCode: 400,
  body: 'Bad Request',
});

/**
 * HTTP Error response.
 *
 * @param {string} body response body
 * @returns {object} 502 Upstream Error response
 */
const UPSTREAM_ERROR = (body) => ({
  statusCode: 502,
  body,
});

/**
 * HTTP Success response.
 *
 * @param {string} body response body
 * @returns {object} 200 Success response
 */
const SUCCESS_RESPONSE = (body) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/calendar; charset=utf-8',
    'cache-control': 'private',
    'connection': 'close',
    'x-application': 'fix-shitty-outlook-ics-timezone',
    'content-length': body.length,
  },
  body,
});

/**
 * Entrypoint.
 *
 * @param {*} event Lambda event
 * @returns {object} Lambda HTTP response
 */
export const handler = async (event) => {
  const url = event.queryStringParameters?.url;
  const http = event.requestContext.http;
  if (http.method !== 'GET' || http.path !== '/ics-fix' || !url?.startsWith('https://')) {
    return BAD_REQUEST();
  }

  try {
    // Get the response body
    const res = await request(url);

    // Replace the timezone with the correct one
    const body = res
      .replace(/AUS Eastern Standard Time/g, 'Australia/Melbourne')
      .replace(/E. Australia Standard Time/g, 'Australia/Melbourne');

    return SUCCESS_RESPONSE(body);
  } catch (err) {
    return UPSTREAM_ERROR(err.message);
  };
};
