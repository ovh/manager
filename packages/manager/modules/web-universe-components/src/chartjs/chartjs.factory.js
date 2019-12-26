import angular from 'angular';
import assignIn from 'lodash/assignIn';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
import last from 'lodash/last';
import merge from 'lodash/merge';

export default /* @ngInject */ (WUC_CHARTJS) => {
  const WucChartjsFactory = function WucChartjsFactory(data) {
    assignIn(this, angular.copy(WUC_CHARTJS.squeleton), data);
  };

  /**
   * Add a serie
   * @param {String} name Name of the serie
   * @param  {Array} data See chartjs (http://www.chartjs.org/docs/latest/charts/line.html#number)
   * @param {Object} opts
   *  - dataset => see chartjs (http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties)
   * @return {Object} new added serie
   */
  WucChartjsFactory.prototype.addSerie = function addSerie(name, data, opts) {
    const options = opts || {};
    this.data.datasets.push(
      assignIn(
        {
          label: name,
          data,
        },
        WUC_CHARTJS.colors[
          this.data.datasets.length % WUC_CHARTJS.colors.length
        ],
        options.dataset,
      ),
    );
    return last(this.data.datasets);
  };

  /**
   * Add callbacks for tooltip generation (http://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks)
   * @param   {String} name     Name of the callback
   * @param {Function} callback Callback
   */
  WucChartjsFactory.prototype.setTooltipCallback = function setTooltipCallback(
    name,
    callback,
  ) {
    if (!this.options.tooltips) {
      this.options.tooltips = {};
    }
    if (!this.options.tooltips.callbacks) {
      this.options.tooltips.callbacks = {};
    }
    this.options.tooltips.callbacks[name] = callback;
  };

  /**
   * Set axis options (http://www.chartjs.org/docs/latest/axes/)
   * @param           {String} axis    One of yAxes or xAxes
   * @param           {object} options Options to merge
   * @param {Number|undefined} index Index of axis or all
   */
  WucChartjsFactory.prototype.setAxisOptions = function setAxisOptions(
    axis,
    options,
    index,
  ) {
    if (isUndefined(index)) {
      this.options.scales[axis].forEach((data) => {
        merge(data, options);
      });
    } else {
      merge(this.options.scales[index], options);
    }
  };

  /**
   * Set title on the Y Label
   * @param {String} label Label to set
   */
  WucChartjsFactory.prototype.setYLabel = function setYLabel(label) {
    if (
      this.options.scales.yAxes.length &&
      head(this.options.scales.yAxes) &&
      head(this.options.scales.yAxes).scaleLabel
    ) {
      this.options.scales.yAxes[0].scaleLabel.labelString = label;
    }
  };

  return WucChartjsFactory;
};
