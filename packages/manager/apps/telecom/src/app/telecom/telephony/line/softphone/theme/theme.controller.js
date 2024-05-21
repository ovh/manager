export default class ThemeController {
  toggleSelected() {
    this.selected = this.themeId;
  }

  isSelected() {
    return this.selected === this.themeId;
  }
}
