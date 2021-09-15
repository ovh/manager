import remove from 'lodash/remove';
import pull from 'lodash/pull';

export default class PciTagsInputController {
  $onInit() {
    this.items = [];
    this.tag = '';
    this.model.forEach((element) => {
      this.items.push({ title: element });
    });
  }

  addTag() {
    if (!this.isDisabled()) {
      this.model.push(this.tag);
      this.items.push({ title: this.tag });
      this.tag = '';
    }
  }

  removeTag(tag) {
    pull(this.model, tag.title);
    remove(this.items, (i) => i.title === tag);
  }

  isDisabled() {
    const isEmptyOrSpaces =
      this.tag === null || this.tag.match(/^ *$/) !== null;
    return isEmptyOrSpaces || this.model.indexOf(this.tag) !== -1;
  }

  handleKeyPressed(key) {
    if (key.which === 13) {
      this.addTag();
    }
  }
}
