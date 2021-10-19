import remove from 'lodash/remove';
import pull from 'lodash/pull';
import {
  DEFAULT_MIN_LENGTH,
  DEFAULT_MAX_LENGTH,
  DEFAULT_PATTERN,
} from './tags-input.constants';

export default class PciTagsInputController {
  $onInit() {
    this.items = [];
    this.tag = '';
    this.model.forEach((element) => {
      this.items.push({ title: element });
    });
    this.min = this.min || DEFAULT_MIN_LENGTH;
    this.max = this.max || DEFAULT_MAX_LENGTH;
    this.pattern = this.pattern || DEFAULT_PATTERN;
  }

  addTag() {
    if (!this.isDisabled()) {
      this.model.push(this.tag);
      this.items.push({ title: this.tag });
      this.tag = '';
    }
  }

  removeTag(tag) {
    // Workaround to fix oui-chip bug
    document.getElementsByClassName('oui-chip_closable').forEach((e) => {
      e.setAttribute('type', 'button');
    });
    pull(this.model, tag.title);
    remove(this.items, (i) => i.title === tag);
  }

  isDisabled() {
    const isEmptyOrSpaces = !this.tag || this.tag.match(/^ *$/) !== null;
    return isEmptyOrSpaces || this.model.indexOf(this.tag) !== -1;
  }

  handleKeyPressed(e) {
    if (e.which === 13) {
      this.addTag();
      e.preventDefault();
    }
  }
}
