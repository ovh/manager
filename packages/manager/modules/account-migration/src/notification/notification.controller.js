import { FAQ_LINK } from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    atInternet,
    accountMigrationService,
    coreConfig,
    coreURLBuilder,
    OvhApiMe,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.accountMigrationService = accountMigrationService;
    this.OvhApiMe = OvhApiMe;

    this.AGREEMENTS_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/autorenew/agreements',
    );
    this.CONTACTS_URL = coreConfig.isRegion('EU')
      ? coreURLBuilder.buildURL('dedicated', '#/contacts/services')
      : '';
    this.ORDERS_URL = coreURLBuilder.buildURL('dedicated', '#/billing/orders');
    this.DEBT_PAY_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/history/debt/all/pay',
    );

    this.migrationDetail = null;
    this.needMigration = false;
  }

  $onInit() {
    return this.$q
      .all({
        migrations: this.accountMigrationService.getMigrationList(),
        migrationDates: this.accountMigrationService.getFormattedDates(),
      })
      .then(({ migrations: [migration], migrationDates }) => {
        if (migration) {
          this.faqLink = FAQ_LINK[migration.from];
          if (migrationDates) {
            this.migrationStartDate = migrationDates.START;
            this.migrationEndDate = migrationDates.END;
          }
          return this.accountMigrationService
            .getMigrationDetails(migration.id)
            .then((res) => {
              this.migrationDetail = res;
            });
        }
        return null;
      });
  }

  trackClick(type) {
    let trackText = null;
    switch (type) {
      case 'billing':
        trackText =
          'bills:server::dedicated::account::billing::alert::go-to-billing-link';
        break;
      case 'debt':
        trackText = 'alert::notifications::go-to-billing';
        break;
      case 'agreements':
        trackText = 'alert::notifications::go-to-agreements';
        break;
      case 'faq':
        trackText = 'alert::notifications::go-to-faq-agreement';
        break;
      case 'order':
        trackText = 'alert::notifications::go-to-orders';
        break;
      case 'contact':
        trackText = 'alert::notifications::go-to-contact-services';
        break;
      default:
        trackText = type;
    }

    this.atInternet.trackClick({
      name: trackText,
      type: 'action',
    });
  }
}
