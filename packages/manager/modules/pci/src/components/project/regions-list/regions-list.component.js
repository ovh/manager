import controller from './regions-list.controller';
import template from './regions-list.html';

export default {
  controller,
  template,
  bindings: {
    regions: '<',
    selectedRegion: '=?',
    onChange: '&?',
    displaySelectedRegion: '<',
    quotaUrl: '<?',
  },
};
