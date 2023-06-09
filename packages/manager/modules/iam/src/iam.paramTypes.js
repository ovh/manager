import { isEqual } from 'lodash-es';

import { ENTITY } from './iam.constants';

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
const cursorsPattern = new RegExp(`^([0-9]+-([0-9]+:${base64},?)*)$`);

/**
 * Encode a cursors object to a string
 * { "index": 3, "2": "base64_cursor_2", "3": "base64_cursor_3" } => "3-2:base64_cursor_2,3:base64_cursor_3"
 * @param {Object} object
 * @returns {string}
 */
const encodeCursors = (object) => {
  if (!object) return '';
  const { index, ...cursors } = object;
  const entries = Object.entries(cursors)
    .filter(([x]) => x >= 2 && x <= index)
    .map(([x, cursor]) => `${x}:${cursor}`)
    .join(',');
  return entries ? `${index}-${entries}` : '';
};

/**
 * Decode a cursors object from a string
 * "3-2:base64_cursor_2,3:base64_cursor_3" => { "index": 3, "2": "base64_cursor_2", "3": "base64_cursor_3" }
 * @param {string} string
 * @returns {Object}
 */
const decodeCursors = (string) => {
  if (!string) return null;
  const [index, entries] = string.split('-');
  return entries
    .split(',')
    .filter(Boolean)
    .reduce(
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
  if (!object) return true;
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

const cursors = {
  decode: decodeCursors,
  encode: encodeCursors,
  equals: areCursorsEquals,
  is: isCursors,
  pattern: cursorsPattern,
  type: cursorsType,
};

/**
 * @description
 * An URN is a unique string representation of a resource, a resourceGroup, or an indentity
 * For instances
 * urn:v1:eu:resourceGroup:49afabca-6804-4e36-bd2e-c9be98098d24
 * urn:v1:eu:resource:nutanix:749ee28f-312b-410a-9c63-b062480c63fd
 */

const urnType = 'urn';
const urnPattern = /urn:v[0-9]:(?:eu|ca|us):[a-z]+:.+/;
const urnRegExp = /^urn:v([0-9]):(eu|ca|us):([a-z]+):(.+?)$/;

/**
 * Encode a urn object to a string
 * @param {Object} object
 * @returns {string}
 */
const encodeUrn = (object) => {
  const { version, region, entity, components } = object;
  return [
    'urn',
    `v${version}`,
    region.toLowerCase(),
    entity,
    ...components,
  ].join(':');
};

/**
 * Decode a urn object from a string
 * @param {string} string
 * @returns {Object}
 */
const decodeUrn = (string) => {
  const [match, version, region, entity, components] =
    urnRegExp.exec(string) || [];
  if (!match) {
    return null;
  }
  const splittedComponents = components.split(':');
  return {
    version: parseInt(version, 10),
    region: region.toUpperCase(),
    entity,
    components: splittedComponents,
    componentsString: splittedComponents.slice(1).join(':'),
  };
};

/**
 * Whether the given object is of type urn
 * @param {Object} object
 * @returns {boolean}
 */
const isUrn = (object) => {
  if (!object) return false;
  const { version, region, entity, components } = object;
  return (
    version > 0 &&
    ['EU', 'US', 'CA'].includes(region) &&
    Object.values(ENTITY).includes(entity) &&
    components.length > 0
  );
};

/**
 * Whether the given urns objects are the same
 * @param {Object} urnA
 * @param {Object} urnB
 * @returns {boolean}
 */
const areUrnEquals = (urnA, urnB) => urnA === urnB || isEqual(urnA, urnB);

const urn = {
  decode: decodeUrn,
  encode: encodeUrn,
  equals: areUrnEquals,
  is: isUrn,
  pattern: urnPattern,
  type: urnType,
};

/**
 * @description
 * RFC4122 UUID
 * https://www.ietf.org/rfc/rfc4122.txt
 */

const uuidType = 'uuid';
const uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

/**
 * Whether the passed object is of type uuid
 * @param {any} uuid
 * @returns {boolean}
 */
const isUUID = (uuid) => uuidPattern.test(uuid);

const uuid = {
  is: isUUID,
  pattern: uuidPattern,
  type: uuidType,
};

export {
  areCursorsEquals,
  cursorsType,
  decodeUrn,
  encodeUrn,
  uuidType,
  urnType,
};

export default {
  cursors,
  urn,
  uuid,
};
