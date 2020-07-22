import controller from './data.controller';
import template from './data.html';

export default {
  controller,
  template,
  bindings: {
    dataList: '<',
    data: '<',
    dataInfo: '<',
    addDataLink: '<',
    attachData: '<',
    allRegions: '<',
  },
};
