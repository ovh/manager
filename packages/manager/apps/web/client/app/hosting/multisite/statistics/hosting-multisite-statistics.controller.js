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
    return this.getStatistics(domain, period?.value)
      .then((statistics) => {
        this.fillChart(statistics, period?.value);
      })
      .catch(async (error) => {
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
      })
      .finally(() => {
        this.isLoadingStatistics = false;
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
        legend: {
          position: 'bottom',
          display: true,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        tooltips: {
          mode: 'label',
          intersect: false,
          callbacks: {
            title([firstData]) {
              return moment(firstData.xLabel).fromNow();
            },
          },
        },
        scales: {
          yAxes: [
            {
              display: true,
              position: 'left',
              gridLines: {
                drawBorder: true,
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'hits/min',
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              position: 'bottom',
              gridLines: {
                drawBorder: true,
                display: false,
              },
              time: {
                min: xMin,
                max: xMax,
                displayFormats: {
                  hour: 'YYYY/MM/DD LT',
                  week: 'YYYY/MM/DD',
                  month: 'YYYY/MM/DD',
                  year: 'YYYY/MM/DD',
                },
              },
            },
          ],
        },
      },
    };
  }
}
