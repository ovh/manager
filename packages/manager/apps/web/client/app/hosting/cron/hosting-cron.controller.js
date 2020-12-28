import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class HostingCronsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $timeout,
    $translate,
    atInternet,
    Alerter,
    Hosting,
    HostingCron,
    User,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.Hosting = Hosting;
    this.HostingCron = HostingCron;
    this.User = User;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting::cron' });

    this.crons = {
      details: [],
    };
    this.guide = null;
    this.search = {
      text: null,
    };
    this.hasResult = false;
    this.loading = {
      cron: false,
      init: true,
    };

    return this.getGuides();
  }

  getGuides() {
    return this.User.getUrlOf('guides').then((guides) => {
      if (guides && guides.hostingCron) {
        this.guide = guides.hostingCron;
      }
    });
  }

  getCrons({ criteria }) {
    let filters = null;
    if (!isEmpty(criteria)) {
      const { value } = head(criteria);
      filters = [{ command: value }, { description: value }, { email: value }];
    }
    return this.HostingCron.getCrons(this.$stateParams.productId, filters)
      .then((crons) => ({
        data: map(crons, (id) => ({ id })),
        meta: {
          totalCount: crons.length,
        },
      }))
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('this.hosting_tab_CRON_configuration_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }

  getCron({ id }) {
    return this.HostingCron.getCron(this.$stateParams.productId, id).then(
      (cron) => ({
        ...cron,
        displayedLanguage: this.HostingCron.formatLanguage(cron.language),
      }),
    );
  }

  modifyCron(cron) {
    return this.$scope.setAction('cron/add-or-edit/hosting-cron-add-or-edit', {
      cron,
    });
  }

  deleteCron(cron) {
    return this.$scope.setAction('cron/delete/hosting-cron-delete', cron);
  }
}

angular.module('App').controller('HostingCronsCtrl', HostingCronsCtrl);
