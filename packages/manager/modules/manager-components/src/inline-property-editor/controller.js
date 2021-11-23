export default class {
  constructor() {
    this.isEditing = false;
  }

  $onInit() {
    this.PATTERN = this.pattern ? new RegExp(this.pattern) : /.*/g;
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }
}
