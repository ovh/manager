export const CONNECTOR_STATUS = {
  CREATING: 'CREATING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FAILED: 'FAILED',
};
export const TASK_STATUS = {
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
  PAUSED: 'PAUSED',
};
export const AVAILABLE_CONNECTOR_TYPES = {
  SINK: 'sink',
  SOURCE: 'source',
};

export const CONNECTOR_FIELDS_FILTER_EDIT = ['name', 'connector.class'];

export const TRANSFORM_CONFIG_GROUP_KEY = 'transformType';
export const CONNECTOR_CONFIG_GROUP_KEY = 'group';
export const TRANSFORM_PROPERTY_KEY = 'transform';
export const EMPTY_GROUP_NAME = 'Other';

export const CONNECTOR_FIELDS_TYPE = {
  PASSWORD: 'password',
  INT16: 'int16',
  INT32: 'int32',
  INT64: 'int64',
  BOOLEAN: 'boolean',
  CLASS: 'class',
  STRING: 'string',
  LIST: 'list',
};

export const CLASS_PROPERTY_AS_STRING = ['header.converter'];

export const TRANSFORM_PROPERTY = 'transforms';
export const EXTRA_CONFIG_PROPERTY = '*';

export const GROUP_NAMES_WITH_MESSAGES = {
  TRANSFORMS: 'Transforms',
  EXTRA: 'Extra',
};

export default {
  CONNECTOR_STATUS,
  TASK_STATUS,
  AVAILABLE_CONNECTOR_TYPES,
  CONNECTOR_FIELDS_FILTER_EDIT,
  TRANSFORM_CONFIG_GROUP_KEY,
  CONNECTOR_CONFIG_GROUP_KEY,
  TRANSFORM_PROPERTY_KEY,
  EMPTY_GROUP_NAME,
  CONNECTOR_FIELDS_TYPE,
  CLASS_PROPERTY_AS_STRING,
  TRANSFORM_PROPERTY,
  EXTRA_CONFIG_PROPERTY,
  GROUP_NAMES_WITH_MESSAGES,
};
