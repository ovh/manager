import get from 'lodash/get';

import { PAGE_SECTIONS } from './hosting-database-order-private.constants';

export default class HostingDatabaseOrderPrivateCtrl {
  /* @ngInject */
  constructor($anchorScroll, $translate, Alerter) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.PAGE_SECTIONS = PAGE_SECTIONS;
  }

  $onInit() {
    this.alerts = {
      main: 'app.hosting.dashboard.database.order-private',
    };
  }

  onError(error) {
    this.Alerter.error(
      this.$translate.instant('hosting_database_order_private_error', {
        message: get(error, 'data.message', error),
      }),
      this.alerts.main,
    );
    this.scrollToTop();
  }

  onSuccess(url) {
    this.goBack(
      this.$translate.instant('hosting_database_order_private_success', {
        orderUrl: url,
      }),
    );
  }

  scrollToTop() {
    this.$location.hash(this.PAGE_SECTIONS.BACK_BUTTON);
    this.$anchorScroll();
  }
}
