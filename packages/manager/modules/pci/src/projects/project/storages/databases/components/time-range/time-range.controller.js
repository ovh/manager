export default class {
  selectTimeRange(timeRange) {
    this.selectedRange = timeRange;
    this.onChange({ selectedTimeRange: this.selectedRange });
  }
}
