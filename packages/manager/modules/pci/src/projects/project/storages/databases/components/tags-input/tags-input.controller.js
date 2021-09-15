import remove from 'lodash/remove';

export default class {
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
    this.model.pop(tag);
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
