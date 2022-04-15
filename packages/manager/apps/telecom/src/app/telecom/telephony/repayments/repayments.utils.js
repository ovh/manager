/**
 * Converts ISO 8601 duration format to seconds
 * @param {string} duration ISO 8601 duration string
 * @returns {number} Duration as seconds
 */
export function formatDuration(duration) {
  return moment.duration(duration).asSeconds();
}

export default {
  formatDuration,
};
