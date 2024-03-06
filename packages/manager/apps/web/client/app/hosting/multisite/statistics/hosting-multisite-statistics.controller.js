import {
  CDN_TYPE_BUSINESS,
  CDN_SERIES,
} from './hosting-multisite-statistics.constants';

export default class HostingMultisiteStatistisController {
  $onInit() {
    this.domainList = this.domains.map(({ domain }) => domain);

    [this.period] = this.periods;
  }

  fillChart(statistics, period) {
    this.chart = this.chartJsFactory(
      HostingMultisiteStatistisController.getChartConfiguration(period),
    );

    statistics.forEach((serie) => {
      this.chart.addSerie(
        serie.name,
        serie.points.map(({ timestamp, value }) => {
          return {
            x: timestamp,
            y: parseFloat(value.toFixed(2)),
          };
        }),
        {
          dataset: {
            fill: serie.name === CDN_SERIES.NAME.HIT,
            borderWidth: 1,
            borderColor:
              serie.name === CDN_SERIES.NAME.HIT
                ? CDN_SERIES.COLORS.TURQUOISE
                : CDN_SERIES.COLORS.RED,
          },
        },
      );
    });
  }

  getDomainStatistics(domain, period) {
    if (!domain) {
      return null;
    }

    this.isLoadingStatistics = true;
    this.hasLoadingError = false;
    this.isCdnUpgradeRequired = false;
    this.migration = false;

    return this.getStatistics(domain, period?.value)
      .then((statistics) => {
        this.fillChart(statistics, period?.value);
        return null;
      })
      .catch(async (error) => {
        if (error.status >= 500) {
          this.migration = true;
          return null;
        }
        try {
          const { type: cdnType } = await this.getCdnProperties();
          if (error.status === 404 && cdnType === CDN_TYPE_BUSINESS) {
            this.isCdnUpgradeRequired = true;
          } else {
            this.hasLoadingError = true;
          }
        } catch (err) {
          this.hasLoadingError = true;
        }
        return null;
      })
      .finally(() => {
        this.isLoadingStatistics = false;
        return null;
      });
  }

  static getChartConfiguration(period) {
    const xMin = moment().subtract(1, `${period}s`);
    const xMax = moment();

    return {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 0,
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            display: true,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title([firstData]) {
                return moment(firstData.xLabel).fromNow();
              },
            },
          },
        },
        scales: {
          y: {
            display: true,
            position: 'left',
            grid: {
              drawBorder: true,
              display: true,
            },
            title: {
              display: true,
              text: 'hits/min',
            },
          },

          x: {
            type: 'time',
            position: 'bottom',
            grid: {
              drawBorder: true,
              display: false,
            },
            time: {
              min: xMin,
              max: xMax,
              displayFormats: {
                hour: 'Pp',
              },
            },
          },
        },
      },
    };
  }
}
