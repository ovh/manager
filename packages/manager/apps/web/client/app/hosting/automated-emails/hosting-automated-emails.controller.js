import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { formatDistanceToNow, parse } from 'date-fns';

export default class HostingTabAutomatedEmailsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $timeout,
    $translate,
    atInternet,
    DATEFNS_LOCALE,
    HostingAutomatedEmails,
    HostingStatistics,
    Alerter,
    $filter,
    WucUser,
    ChartFactory,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.HostingAutomatedEmails = HostingAutomatedEmails;
    this.HostingStatistics = HostingStatistics;
    this.Alerter = Alerter;
    this.DATEFNS_LOCALE = DATEFNS_LOCALE;
    this.$filter = $filter;
    this.WucUser = WucUser;
    this.ChartFactory = ChartFactory;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting::scripts' });

    this.automatedEmails = null;
    this.bounces = [];
    this.currentView = 'INFORMATIONS_VIEW';

    this.loaders = {
      loading: false,
      volumes: false,
      bounces: false,
    };

    this.limits = {
      bounces: 20,
    };

    this.stats = {};

    this.thereAreEmailsInError = true;
    this.isPurging = false;
    this.hasBeenPurge = false;
    this.poll = null;

    this.$scope.$on('hosting.automatedEmails.request.changed', () => {
      this.retrievingAutomatedEmails();
    });

    this.WucUser.getUrlOf('guides').then((guides) => {
      this.guide = get(guides, 'hostingScriptEmail', null);
    });

    return this.retrievingAutomatedEmails();
  }

  loadChart(endpoint, token) {
    this.loaders.volumes = true;
    const query = `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace((mailout_sendmails_count{service_name="${this.$stateParams.productId}"}), "mail", "sent", "", "")) OR label_replace(vector(0), "mail", "sent", "", "")`;

    this.stats.chart = new this.ChartFactory({
      type: 'line',
      plugins: [ChartDatasourcePrometheusPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          'datasource-prometheus': {
            borderWidth: 1,
            errorMsg: {
              message: this.$translate.instant('hosting_tab_STATISTICS_none'),
            },
            noDataMsg: {
              message: this.$translate.instant('hosting_tab_STATISTICS_none'),
            },
            findInBorderColorMap: () => '#848CBC',
            findInBackgroundColorMap: () => '#EAECF4',
            findInLabelMap: () =>
              this.$translate.instant(
                'hosting_tab_AUTOMATED_EMAILS_emails_sent',
              ),
            fill: true,
            tension: 0.5,
            query: (start, end) => {
              const url = `${endpoint}/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${end.toISOString()}&step=1h`;

              const headers = {
                authorization: `bearer ${token}`,
                'content-type': 'application/x-www-form-urlencoded',
              };

              return fetch(url, { headers })
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }

                  return null;
                })
                .then((response) => response.data);
            },
            timeRange: {
              type: 'relative',
              start: -1 * 30 * 24 * 60 * 60 * 1000,
              end: 0,
            },
          },
          legend: {
            position: 'bottom',
            display: true,
          },
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            zoom: {
              enabled: true,
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
              limits: {
                max: 10,
                min: 0.5,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title(data) {
                const date = parse(get(data[0], 'label'), 'PPpp', new Date());
                return formatDistanceToNow(date, {
                  addSuffix: true,
                  locale: this.DATEFNS_LOCALE,
                });
              },
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
            },
            grid: {
              drawBorder: true,
              display: true,
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
              displayFormats: {
                hour: 'LT',
              },
            },
          },
        },
      },
    });
  }

  retrievingEmailsSum(endpoint, token, start) {
    const query = `mailout_sendmails_count{service_name="${this.$stateParams.productId}"} OR vector(0)`;
    const url = `${endpoint}/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${new Date().toISOString()}&step=30m`;

    const headers = {
      authorization: `bearer ${token}`,
      'content-type': 'application/x-www-form-urlencoded',
    };

    return fetch(url, { headers })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return null;
      })
      .then(
        (response) =>
          response.data?.result?.[0]?.values?.reduce(
            (acc, curr) => acc + Number(curr[1]),
            0,
          ) || 0,
      );
  }

  retrievingAutomatedEmails() {
    this.loaders.loading = true;
    this.Alerter.resetMessage(this.$scope.alerts.main);

    return this.HostingAutomatedEmails.getAutomatedEmails(
      this.$stateParams.productId,
    )
      .then((data) => {
        if (
          !isEmpty(this.automatedEmails) &&
          this.automatedEmails.state !== data.state &&
          data.state === 'purging'
        ) {
          this.polling();
        }

        this.automatedEmails = data;
        return this.HostingStatistics.getMetricsToken(
          this.$stateParams.productId,
        ).then(({ endpoint, token }) => {
          const [dailyStart, totalStart] = [new Date(), new Date()];
          dailyStart.setHours(0, 0, 0, 0);
          totalStart.setMonth(totalStart.getMonth() - 1);
          return this.$q
            .all({
              dailySumMails: this.retrievingEmailsSum(
                endpoint,
                token,
                dailyStart,
              ),
              totalSumMails: this.retrievingEmailsSum(
                endpoint,
                token,
                totalStart,
              ),
              chart: this.loadChart(endpoint, token),
              bounces: this.retrievingBounces(),
            })
            .then(({ dailySumMails, totalSumMails }) => {
              this.dailySumMails = dailySumMails;
              this.totalSumMails = totalSumMails;
            });
        });
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_tab_AUTOMATED_EMAILS_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loaders.loading = false;
      });
  }

  retrievingBounces() {
    if (this.bounceLimitForm.$dirty && !this.bounceLimitForm.$valid) {
      return null;
    }

    this.loaders.bounces = true;

    return this.HostingAutomatedEmails.retrievingBounces(
      this.$stateParams.productId,
      this.limits.bounces,
    )
      .then((data) => {
        this.thereAreEmailsInError = !isEmpty(data.data);
        this.bounces = data.data;
      })
      .catch((err) => {
        if (err.status !== 404) {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_AUTOMATED_EMAILS_error'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        } else {
          this.thereAreEmailsInError = false;
        }
      })
      .finally(() => {
        this.loaders.bounces = false;
      });
  }

  changeViewToBounces() {
    this.retrievingBounces();
    this.currentView = 'BOUNCES_VIEW';
  }

  purge() {
    if (
      this.automatedEmails.state !== 'ko' &&
      this.automatedEmails.state !== 'spam' &&
      this.automatedEmails.state !== 'bounce'
    ) {
      return;
    }

    this.$scope.setAction(
      'automated-emails/request/hosting-automated-emails-request',
      {
        automatedEmails: this.automatedEmails,
        action: 'PURGE',
      },
    );
  }

  polling() {
    return this.HostingAutomatedEmails.getAutomatedEmails(
      this.$stateParams.productId,
    ).then((data) => {
      if (data.state === 'purging') {
        this.isPurging = true;
        this.poll = this.$timeout(this.polling, 3000);
      } else {
        this.isPurging = false;
        this.hasBeenPurge = true;
        this.$timeout.cancel(this.poll);
        this.retrievingAutomatedEmails();
      }
    });
  }
}
