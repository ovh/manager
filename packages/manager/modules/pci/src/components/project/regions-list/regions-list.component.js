import controller from './regions-list.controller';
import template from './regions-list.html';

export default {
  controller,
  template,
  bindings: {
    disabled: '<',
    regions: '<',
    selectedRegion: '=?',
    onChange: '&?',
    displaySelectedRegion: '<',
    quotaUrl: '<?',
    currentRegion: '<?',
    deploimentMode: '<?',
  },
};
