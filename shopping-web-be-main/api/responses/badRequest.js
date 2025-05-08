/**
 * badRequest.js
 *
 * A badRequest response.
 *
 */

module.exports = function badRequest(data) {
  // Get access to `req` and `res`
  const res = this.res;
  const req = this.req;
  const sails = req._sails;
  const dataParam = !_.isUndefined(data) ? data: {};
  const ERROR_CODE = 400;
  // Set status code.
  res.status(ERROR_CODE);
  // Prepare messages.
  const message = _.get(dataParam, 'message') || 'Bad request';
  const extras = _.get(dataParam, 'extras') || undefined;
  const error = {
    code: ERROR_CODE,
    message
  };
  const logError = {
    error: {
      ...error,
      // Default request to log.
      params: req.allParams(),
      headers: req.headers,
      method: req.method,
      url: req.originalUrl,
      // Extras data.
      extras
    }
  };
  // Log errors.
  sails.log.error('[400] response: \n', logError);
  const responseMessage = {
    error
  };
  // If the data is an error instance and it doesn't have a custom .toJSON(),
  // use its stack instead (otherwise res.json() will turn it into an empty dictionary).
  if (_.isError(dataParam)) {
    if (!_.isFunction(dataParam.toJSON)) {
      responseMessage.error.stack = data.stack;
      return res.send(responseMessage);
    }
  }
  return res.json(responseMessage);
};
