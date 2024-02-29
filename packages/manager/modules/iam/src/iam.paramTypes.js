import { isEqual } from 'lodash-es';

import { ENTITY, IDENTITY_TYPE } from './iam.constants';

/**
 * @description
 * An URN is a unique string representation of a resource, a resourceGroup, or an indentity
 * For instances
 * urn:v1:eu:resourceGroup:49afabca-6804-4e36-bd2e-c9be98098d24
 * urn:v1:eu:resource:nutanix:749ee28f-312b-410a-9c63-b062480c63fd
 */

const urnType = 'urn';
const urnPattern = /urn:v[0-9]:(?:eu|ca|us|labeu):[a-z]+:.+/;
const urnIdentityRegExp = /^urn:v([0-9]):(eu|ca|us|labeu):([a-z]+):([a-z]+):(.+?)$/;

/**
 * @typedef {Object} UrnIdentityObject
 * @property {string} version - 1,2
 * @property {string} region - eu, us, ca
 * @property {string} entity - identity
 * @property {string} type - user, account, group, credential
 * @property {string} account - xx1111, xx11111-ovh
 * @property {string} id - username, xx11111, usergroupname
 * @property {string} urn - URN
 */

/**
 * Encode a urn object to a string
 * @param {Object} UrnIdentityObject
 * @returns {string}
 */
const encodeIdentityUrn = (object) => {
  const { version, region, entity, type, account, id } = object;
  let value = '';
  switch (type) {
    case IDENTITY_TYPE.USER:
      value = `${account}/${id}`;
      break;
    case IDENTITY_TYPE.GROUP:
      value = `${account}/${id}`;
      break;
    case IDENTITY_TYPE.ACCOUNT:
      value = `${account}`;
      break;
    case IDENTITY_TYPE.SERVICE_ACCOUNT:
      value = `${account}`;
      break;
    default:
      break;
  }
  return ['urn', `v${version}`, region.toLowerCase(), entity, type, value].join(
    ':',
  );
};

/**
 * Decode a urn identity object from a string
 * @param {string} urn
 * @returns {UrnIdentityObject}
 */
const decodeIdentityUrn = (urn) => {
  const [match, version, region, entity, type, value] =
    urnIdentityRegExp.exec(urn) || [];
  if (!match) {
    return null;
  }
  let account;
  let id;

  switch (type) {
    case IDENTITY_TYPE.USER:
      {
        const [acc, userId] = value.split('/');
        account = acc;
        id = userId;
      }
      break;
    case IDENTITY_TYPE.GROUP:
      {
        const [acc, groupId] = value.split('/');
        account = acc;
        id = groupId;
      }
      break;
    case IDENTITY_TYPE.ACCOUNT:
      account = value;
      id = value;
      break;
    case IDENTITY_TYPE.SERVICE_ACCOUNT:
      {
        const [acc, client] = value.split('/');
        const index = client.indexOf('-');
        const clientId = client.substring(index + 1);
        account = acc;
        id = clientId;
      }
      break;
    default:
      break;
  }

  return {
    version: parseInt(version, 10),
    region,
    entity,
    type,
    account,
    id,
    urn,
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

export { encodeIdentityUrn, decodeIdentityUrn, uuidType, urnType };

export default {
  urn,
  uuid,
};
