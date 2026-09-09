/**
 * src/utils/response.js
 * Week 3 → Week 5: Single standardized envelope for success & error
 * Success: { status, data, error: null }
 * Error:   { status, data: null, error, field }
 * No stack traces ever leak.
 */

function success(res, status, data) {
  return res.status(status).json({ status, data, error: null });
}

function fail(res, status, error, field = null) {
  return res.status(status).json({ status, data: null, error, field });
}

module.exports = { success, fail };
