import assignIn from 'lodash/assignIn';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
import last from 'lodash/last';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';
import uniqueId from 'lodash/uniqueId';
import angular from 'angular';

export default /* @ngInject */ (PCI_CHARTS) => {
  const ChartjsFactory = function ChartjsFactory(data) {
    assignIn(this, angular.copy(PCI_CHARTS.squeleton), data);
  };

  /**
   * Add a serie
   * @param {String} name Name of the serie
   * @param  {Array} data See chartjs (http://www.chartjs.org/docs/latest/charts/line.html#number)
   * @param {Object} opts
   *  - dataset => see chartjs (http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties)
   * @return {Object} new added serie
   */
  ChartjsFactory.prototype.addSerie = function addSerie(name, data, opts = {}) {
    this.data.datasets.push(
      assignIn(
        {
          label: name,
          data,
        },
        PCI_CHARTS.colors[this.data.datasets.length % PCI_CHARTS.colors.length],
        opts.dataset,
      ),
    );
    return last(this.data.datasets);
  };

  /**
   * Add a serie
   * @param {String} name Name of the serie
   * @param  {Array} data See chartjs (http://www.chartjs.org/docs/latest/charts/line.html#number)
   * @param {Object} opts
   *  - dataset => see chartjs (http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties)
   * @return {Object} new added serie
   */
  ChartjsFactory.prototype.updateSerie = function updateSerie(
    name,
    data,
    opts,
  ) {
    const options = opts || {};
    const datasetIndex = findIndex(this.data.datasets, (dataset) => {
      return dataset.label === name;
    });
    if (datasetIndex !== -1) {
      this.data.datasets[datasetIndex] = assignIn(
        this.data.datasets[datasetIndex],
        {
          label: name,
          data,
        },
        PCI_CHARTS.colors[datasetIndex % PCI_CHARTS.colors.length],
        options.dataset,
      );
      this.data.hash = uniqueId();
      return this.data.datasets[datasetIndex];
    }
    return this.addSerie(name, data, opts);
  };

  /**
   * Add callbacks for tooltip generation (http://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks)
   * @param   {String} name     Name of the callback
   * @param {Function} callback Callback
   */
  ChartjsFactory.prototype.setTooltipCallback = function setTooltipCallback(
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
  ChartjsFactory.prototype.setAxisOptions = function setAxisOptions(
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
  ChartjsFactory.prototype.setYLabel = function setYLabel(label) {
    if (
      this.options.scales.yAxes.length &&
      head(this.options.scales.yAxes) &&
      head(this.options.scales.yAxes).scaleLabel
    ) {
      this.options.scales.yAxes[0].scaleLabel.labelString = label;
    }
  };

  /**
   * Set title of the chart
   * @param {String} label Label to set
   */
  ChartjsFactory.prototype.setTitle = function setTitle(title) {
    if (!this.options.title) {
      this.options.title = { display: true };
    }
    this.options.title.text = title;
  };

  return ChartjsFactory;
};
