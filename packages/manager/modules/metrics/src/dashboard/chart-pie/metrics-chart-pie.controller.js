export default class MetricsChartPieController {
  /* @ngInject */
  constructor() {
    this.rayon = 25;
    this.offset = -25; // to start at the top
    this.ringSize = 2 * Math.PI * this.rayon;
  }

  $onInit() {
    if (Number.isNaN(this.text)) {
      this.text = '0';
    }
  }

  percentToSize(percent) {
    return (percent * this.ringSize) / 100 || 0;
  }
}
