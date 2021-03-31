import isFunction from 'lodash/isFunction';

export default class WebPaasProjectTemplateCtrl {
  onSelected(template) {
    if (isFunction(this.onSelect)) {
      this.onSelect(template);
    }
  }
}
