export const CDN_ADVANCED = 'cdn-advanced';
export const RESOURCE_TYPE_EXTENSION = 'extension';
export const RESOURCE_REGEX = {
  extension: /^[\w\d]+$/,
  folder: '',
  regex: '',
  uri: '',
};
export const RESOURCE_TYPES_PLACEHOLDER = {
  FOLDER: '/folder/',
  URI: '/folder/file.jpg',
  EXTENSION: 'jpg',
  REGEX: '.*/file.jpg$',
};

export default {
  CDN_ADVANCED,
  RESOURCE_TYPES_PLACEHOLDER,
};
