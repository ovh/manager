import isFunction from 'lodash/isFunction';

export default class WebPaasProjectTemplateCtrl {
  constructor() {
    this.offset = 1;
    this.pageSize = 10;
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

  onSelected(template) {
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
