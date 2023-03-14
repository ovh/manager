import { isEqual } from 'lodash-es';

/**
 * @description
 * The purpose of this param type is to demonstrate how the Manager can handle
 * a full set of cursor ids given by the API, allowing back and forth navigation
 * trough the results set of a APIv2 endpoint
 *
 * /!\
 *
 * At the time of writing, the API only gives the next cursor of each subset of results
 * As soon as the previous cursor is implemented, this param type should be fully reworked
 *
 * /!\
 */

const base64 = '(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?';
const base64RE = new RegExp(`^${base64}$`);
const cursorsType = 'cursors';
const cursorsPattern = new RegExp(`^[0-9]+-([0-9]+:${base64},?)*$`);

/**
 * Encode a cursors object to a string
 * { "index": 1, "2": "base64_cursor_2", "3": "base64_cursor_3" } => "1-2:base64_cursor_2,3:base64_cursor_3"
 * @param {Object} object
 * @returns {string}
 */
const encodeCursors = (object) => {
  const { index, ...cursors } = object;
  const entries = Object.entries(cursors)
    .map(([x, cursor]) => `${x}:${cursor}`)
    .join(',');
  return `${index}-${entries}`;
};

/**
 * Decode a cursors object from a string
 * "1-2:base64_cursor_2,3:base64_cursor_3" => { "index": 1, "2": "base64_cursor_2", "3": "base64_cursor_3" }
 * @param {string} string
 * @returns {Object}
 */
const decodeCursors = (string) => {
  const [index, entries] = string.split('-');
  return entries.split(',').reduce(
    (map, entry) => {
      const [x, cursor] = entry.split(':');
      return { ...map, [x]: cursor };
    },
    { index: parseInt(index, 10) },
  );
};

/**
 * Whether the given object is of type cursors
 * @param {Object} object
 * @returns {boolean}
 */
const isCursors = (object) => {
  if (!object) return false;
  const { index, ...cursors } = object;
  return (
    parseInt(index, 10) >= 0 &&
    Object.values(cursors).every((cursor) => base64RE.test(cursor)) &&
    Object.keys(cursors).every((x) => parseInt(x, 10) > 0)
  );
};

/**
 * Whether the given cursors objects are the same
 * @param {Object} cursorsA
 * @param {Object} cursorsB
 * @returns {boolean}
 */
const areCursorsEquals = (cursorsA, cursorsB) =>
  cursorsA === cursorsB || isEqual(cursorsA, cursorsB);

export { areCursorsEquals, cursorsType };
export default {
  decode: decodeCursors,
  encode: encodeCursors,
  equals: areCursorsEquals,
  is: isCursors,
  pattern: cursorsPattern,
  type: cursorsType,
};
