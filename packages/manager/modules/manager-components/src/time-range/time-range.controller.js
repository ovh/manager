export default class {
  selectTimeRange(timeRange) {
    this.selectedRange = timeRange;
    if (this.onChange) {
      this.onChange({ selectedTimeRange: this.selectedRange });
    }
  }
}
