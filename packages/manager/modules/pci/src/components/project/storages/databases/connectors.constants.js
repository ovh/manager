export const CONNECTOR_STATUS = {
  CREATING: 'CREATING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
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
