import isFunction from 'lodash/isFunction';

export default class PlatformShProjectTemplateCtrl {
onSelected(template) {
    if (isFunction(this.onSelect)) {
      this.onSelect(template);
    }
  }
}
