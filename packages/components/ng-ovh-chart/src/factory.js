import assignIn from 'lodash/assignIn';
import last from 'lodash/last';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';
import uniqueId from 'lodash/uniqueId';
import angular from 'angular';

export default /* @ngInject */ (CHARTS) => {
  const ChartjsFactory = function ChartjsFactory(data) {
    assignIn(this, angular.copy(CHARTS.squeleton), data);
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
        CHARTS.colors[this.data.datasets.length % CHARTS.colors.length],
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
        CHARTS.colors[datasetIndex % CHARTS.colors.length],
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
    if (!this.options.plugins.tooltip) {
      this.options.plugins.tooltip = {};
    }
    if (!this.options.plugins.tooltip.callbacks) {
      this.options.plugins.tooltip.callbacks = {};
    }
    this.options.plugins.tooltip.callbacks[name] = callback;
  };

  /**
   * Set axis options (http://www.chartjs.org/docs/latest/axes/)
   * @param           {String} axis    One of yAxes or xAxes
   * @param           {object} options Options to merge
   */
  ChartjsFactory.prototype.setAxisOptions = function setAxisOptions(
    axis,
    options,
  ) {
    merge(this.options.scales[axis], options);
  };

  /**
   * Set title on the Y Label
   * @param {String} label Label to set
   */
  ChartjsFactory.prototype.setYLabel = function setYLabel(label) {
    if (!this.options.scales.y.title) {
      this.options.scales.y.title = { display: true };
    }
    this.options.scales.y.title.text = label;
  };

  /**
   * Set title of the chart
   * @param {String} label Label to set
   */
  ChartjsFactory.prototype.setTitle = function setTitle(title) {
    if (!this.options.plugins.title) {
      this.options.plugins.title = { display: true };
    }
    this.options.plugins.title.text = title;
  };

  return ChartjsFactory;
};
