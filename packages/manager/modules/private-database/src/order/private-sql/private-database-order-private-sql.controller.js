import get from 'lodash/get';

import { PAGE_SECTIONS } from './private-database-order-private-sql.constants';

export default class PrivateDatabaseOrderPrivateSqlCtrl {
  /* @ngInject */
  constructor($anchorScroll, $location, $translate, Alerter) {
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.PAGE_SECTIONS = PAGE_SECTIONS;
  }

  $onInit() {
    this.alerts = {
      main: 'app.private-database.order',
    };
  }

  onError(error) {
    this.Alerter.error(
      this.$translate.instant('private_database_order_private_sql_error', {
        message: get(error, 'data.message', error),
      }),
      this.alerts.main,
    );
    this.scrollToTop();
  }

  onSuccess(url) {
    this.Alerter.success(
      this.$translate.instant('private_database_order_private_sql_success', {
        orderUrl: url,
      }),
      this.alerts.main,
    );
    this.scrollToTop();
  }

  scrollToTop() {
    this.$location.hash(this.PAGE_SECTIONS.HEADER);
    this.$anchorScroll();
  }
}
