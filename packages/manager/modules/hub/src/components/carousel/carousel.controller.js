export default class {
  constructor() {
    this.index = 0;
  }

  nextAlert() {
    if (this.index === this.items.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }
  }
}
