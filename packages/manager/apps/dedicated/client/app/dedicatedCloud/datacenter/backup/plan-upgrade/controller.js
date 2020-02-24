export default class {
  onSelected(model) {
    if (this.onChange) {
      this.onChange({ modelValue: model });
    }
  }
}
