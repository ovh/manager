import isFunction from 'lodash/isFunction';
import { TEMPLATE_GUIDE_URL } from './constants';

export default class WebPaasProjectTemplateCtrl {
  constructor() {
    this.offset = 1;
    this.pageSize = 10;
    this.TEMPLATE_GUIDE_URL = TEMPLATE_GUIDE_URL;
  }

  $onInit() {
    this.originalList = angular.copy(this.templates);
    this.paginate(this.pageSize, this.offset);
  }

  onChange({ offset, pageSize }) {
    this.paginate(pageSize, offset);
  }

  paginate(pageSize, offset) {
    this.templates = this.originalList.slice(offset - 1, offset + pageSize - 1);
  }

  onTemplateSelect(template) {
    if (isFunction(this.onSelect)) {
      this.onSelect(template);
    }
  }

  onChangeSearch(value) {
    return value === ''
      ? this.paginate(this.pageSize, this.offset)
      : this.paginate(100, 1);
  }
}
