/**
 * ok.js
 *
 * A 200 response.
 *
 */
const util = require('util');

module.exports = function ok(data) {
  // Get access to `req` and `res`
  const res = this.res;
  // Set status code
  res.status(200);
  // If no data was provided, use res.sendStatus().
  if (_.isUndefined(data)) {
    return res.sendStatus(200);
  }
  if (_.isError(data)) {
    if (!_.isFunction(data.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(200);
      }
      // No need to JSON stringify (it's already a string).
      return res.send(util.inspect(data));
    }
  }
  return res.json(data);
};
