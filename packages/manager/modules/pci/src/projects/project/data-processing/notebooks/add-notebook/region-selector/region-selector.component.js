import template from './region-selector.html';

export default {
  template,
  bindings: {
    regions: '<',
    onChangeHandler: '<',
    selectedRegion: '<',
  },
};
