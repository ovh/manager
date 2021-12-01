/**
 * Converts ISO 8601 duration format to seconds
 * @param {string} duration ISO 8601 duration string
 * @returns {number} Duration as seconds
 */
export function formatDuration(duration) {
  return moment.duration(duration).asSeconds();
}

/**
 * @param {string} status CREATED or PAID
 * @returns {string} error or success
 */
export function formatStatus(status) {
  return status === 'CREATED' ? 'success' : 'error';
}

export default {
  formatDuration,
  formatStatus,
};
