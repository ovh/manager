import filter from 'lodash/filter';

export default class {
  $onInit() {
    this.guides = filter(this.resources, { type: 'guide' });
    this.tips = filter(this.resources, { type: 'tip' });
  }
}
