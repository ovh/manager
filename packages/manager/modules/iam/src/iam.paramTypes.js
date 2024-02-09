import { isEqual } from 'lodash-es';

import { ENTITY } from './iam.constants';

/**
 * @description
 * An URN is a unique string representation of a resource, a resourceGroup, or an indentity
 * For instances
 * urn:v1:eu:resourceGroup:49afabca-6804-4e36-bd2e-c9be98098d24
 * urn:v1:eu:resource:nutanix:749ee28f-312b-410a-9c63-b062480c63fd
 */

const urnType = 'urn';
const urnPattern = /urn:v[0-9]:(?:eu|ca|us|labeu):[a-z]+:.+/;
const urnRegExp = /^urn:v([0-9]):(eu|ca|us|labeu):([a-z]+):(.+?)$/;

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

export { decodeUrn, encodeUrn, uuidType, urnType };

export default {
  urn,
  uuid,
};
