/* PATH input */
export const MOCK_PATH_VALID = 'a/valid/path';
export const MOCK_PATH_INVALID_STARTS_WITH_SLASH = '/invalid/path';
export const MOCK_PATH_INVALID_ENDS_WITH_SLASH = 'invalid/path/';
export const MOCK_PATH_INVALID_CONTAINS_TWO_CONSECUTIVE_SLASHES =
  'invalid//path';
export const MOCK_PATH_INVALID_CHARACTERS_NOT_ALLOWED =
  'character not allowed: !';

/* DATA input */
export const MOCK_DATA_VALID_JSON = '{"a": "valid JSON"}';
export const MOCK_DATA_VALID_ARRAY_JSON = '[{"a": "valid array JSON"}]';
export const MOCK_DATA_INVALID_JSON = 'not a json';

/* METADATA input */
export const MOCK_METADATA_VALID = {
  casRequired: 'active' as const,
  deactivateVersionAfter: '30s',
  maxVersions: 5,
};
