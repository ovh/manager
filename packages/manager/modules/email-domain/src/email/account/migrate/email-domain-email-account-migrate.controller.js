import forEach from 'lodash/forEach';
import get from 'lodash/get';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

const allGuides = {
  EU: {
    CZ: 'https://docs.ovh.com/cz/cs/',
    DE: 'https://docs.ovh.com/de/de/',
    ES: 'https://docs.ovh.com/es/web/',
    FI: 'https://docs.ovh.com/fi/fi/',
    FR: 'https://docs.ovh.com/fr/web/',
    GB: 'https://docs.ovh.com/gb/en/',
    IT: 'https://docs.ovh.com/it/it/',
    LT: 'https://docs.ovh.com/lt/lt/',
    NL: 'https://docs.ovh.com/nl/nl/',
    PL: 'https://docs.ovh.com/pl/pl/',
    PT: 'https://docs.ovh.com/pt/pt/',
  },
  CA: {
    ASIA: 'https://docs.ovh.com/asia/en/',
    AU: 'https://docs.ovh.com/au/en/',
    CA: 'https://docs.ovh.com/ca/en/',
    QC: 'https://docs.ovh.com/ca/fr/',
    SG: 'https://docs.ovh.com/sg/en/',
    WE: 'https://docs.ovh.com/ca/en/',
    WS: 'https://docs.ovh.com/us/es/',
  },
};

const emailsOrderGuides = {
  FR: 'https://www.ovh.com/emails/',
  PL: 'https://www.ovh.pl/emaile/',
};

export default class EmailsMigrateAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $q,
    $translate,
    coreConfig,
    Alerter,
    goToEmail,
    WucEmails,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.Alerter = Alerter;
    this.goToEmail = goToEmail;
    this.WucEmails = WucEmails;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.destinationServiceType = {
      EMAIL_PRO: 'EMAIL PRO',
      HOSTED_EXCHANGE: 'HOSTED EXCHANGE',
      PRIVATE_EXCHANGE: 'PRIVATE EXCHANGE',
    };
    this.email = this.$stateParams.email || null;

    this.loaders = {
      isInitialRetrievalRunning: true,
      isWaitingForDestinationEmails: false,
      isWaitingForMigrationCheck: false,
      isWaitingForMigration: false,
    };
    this.isMigrationDataValid = false;

    this.migrate = {};
    this.constants = {
      passwordMaxLength: 30,
      passwordMinLength: 9,
    };

    this.checkMigrationErrors = [];
    this.shouldDisplayCheckMigrationsErrors = false;

    this.$scope.alerts.migrate = 'domain_alert_migrate';
    this.$scope.migrateAccount = () => this.migrateAccount();

    this.allGuides = null;
    if (this.coreConfig.isRegion('EU')) {
      this.allGuides = get(
        allGuides.EU,
        this.coreConfig.getUser().ovhSubsidiary,
        allGuides.EU.FR,
      );
    } else if (this.coreConfig.isRegion('CA')) {
      this.allGuides = get(
        allGuides.CA,
        this.coreConfig.getUser().ovhSubsidiary,
        allGuides.CA.CA,
      );
    }

    this.emailsOrder = null;
    if (this.coreConfig.isRegion('EU')) {
      this.emailsOrder = get(
        emailsOrderGuides,
        this.coreConfig.getUser().ovhSubsidiary,
        emailsOrderGuides.FR,
      );
    }

    this.getServiceTypes();
  }

  // Request Service types
  getServiceTypes() {
    this.loaders.isInitialRetrievalRunning = true;
    this.destinationServices = null;
    this.migrate.destinationService = null;

    // First, get the models for the service types
    this.WucEmails.getModels().then((data) => {
      this.models = data.models;
      this.getDestinationServices(
        this.models['email.domain.MigrationServiceType'].enum,
      );
    });
  }

  // Get destination services from all service types
  getDestinationServices(serviceTypes) {
    const promises = [];
    angular.forEach(serviceTypes, (service) => {
      promises.push(this.getDestinationServicesFromType(service));
    });

    this.$q.allSettled(promises).then((data) => {
      this.destinationServices = {};
      this.availableServices = 0;

      // Merge destinationServices with serviceTypes, and get available services
      angular.forEach(serviceTypes, (serviceType, index) => {
        if (data[index].length) {
          const services = map(data[index], (destinationService) => ({
            id: destinationService,
            name: destinationService,
            type: serviceType,
          }));

          this.destinationServices[serviceType] = services;
          this.availableServices += 1;
        }
      });

      this.loaders.isInitialRetrievalRunning = false;
    });
  }

  // Request services list from service type
  getDestinationServicesFromType(type) {
    return this.WucEmails.getDestinationServices(
      this.email.domain,
      this.email.accountName,
      type,
    ).catch((err) => this.handleError(err));
  }

  // Get Destination email (@configure.me)
  getDestinationEmails(destinationService) {
    // Check for destination service
    if (angular.isUndefined(destinationService)) {
      return;
    }

    this.loaders.isWaitingForDestinationEmails = true;
    this.resetError();

    // Reset for ngChange
    this.destinationEmails = [];
    this.remainingAvailableEmails = null;
    this.migrate.destinationEmail = null;

    this.isMigrationDataValid = false;

    // Get available email addresses for the migration
    this.WucEmails.getDestinationEmailAddresses(
      this.email.domain,
      this.email.accountName,
      destinationService,
    )
      .then((data) => {
        this.loaders.isWaitingForDestinationEmails = false;
        this.destinationEmails = data;

        // Auto select the first email
        if (this.destinationEmails && this.destinationEmails.length > 0) {
          this.remainingAvailableEmails = this.destinationEmails.length - 1;
          [this.migrate.destinationEmail] = this.destinationEmails;
        }
      })
      .catch((err) => this.handleError(err))
      .finally(() => {
        this.loaders.isWaitingForDestinationEmails = false;
        this.isExchange =
          get(this, 'migrate.destinationService.type') !==
          this.destinationServiceType.emailPro;
      });
  }

  // Check if it's possible to migrate
  checkMigrationData() {
    this.loaders.isWaitingForMigrationCheck = true;
    this.checkMigrationErrors = [];
    this.shouldDisplayCheckMigrationsErrors = false;

    this.WucEmails.checkMigrate(
      this.email.domain,
      this.email.accountName,
      this.migrate.destinationService.name,
      this.migrate.destinationEmail,
    )
      .then(() => {
        this.isMigrationDataValid = true;
      })
      .catch((err) => {
        this.isMigrationDataValid = false;
        if (isArray(err)) {
          this.displayCheckMigrationErrors(err);
        } else {
          this.handleError(err);
        }
      })
      .finally(() => {
        this.loaders.isWaitingForMigrationCheck = false;
      });
  }

  // Post request for migration
  migrateAccount() {
    this.loaders.isWaitingForMigration = true;

    this.WucEmails.migrateAccountToDestinationAccount(
      this.email.domain,
      this.email.accountName,
      this.migrate.destinationService.name,
      this.migrate.destinationEmail,
      this.migrate.password,
    )
      .then(() => {
        if (
          get(this, 'migrate.destinationService.type') ===
          this.destinationServiceType.emailPro
        ) {
          this.Alerter.success(
            this.$translate.instant('email_tab_modal_migrate_success_emailpro'),
            this.$scope.alerts.main,
          );
        } else {
          this.Alerter.success(
            this.$translate.instant('email_tab_modal_migrate_success_exchange'),
            this.$scope.alerts.main,
          );
        }

        this.goToEmail();
      })
      .catch((err) => this.handleError(err))
      .finally(() => {
        this.loaders.isWaitingForMigration = false;
      });
  }

  // Handle services errors
  handleError(err) {
    this.Alerter.alertFromSWS(
      this.$translate.instant('email_tab_modal_migrate_error'),
      get(err, 'data', err),
      this.$scope.alerts.migrate,
    );
  }

  resetError() {
    this.checkMigrationErrors = [];
    this.Alerter.resetMessage(this.$scope.alerts.migrate);
  }

  displayCheckMigrationErrors(errors) {
    const checkMigrationErrorCodes = errors.map((error) => get(error, 'code'));

    const shouldRetry = isEmpty(
      intersection(checkMigrationErrorCodes, [
        'ACCOUNT_EMPTY',
        'DOMAIN_EMPTY',
        'FORWARD_EXIST',
        'FORWARD_LOCAL',
        'MAILINGLIST_EXIST',
        'MAILPROXY_BAD_INFRA',
        'MAILPROXY_EMPTY',
        'UNKNOW',
      ]),
    );

    const checkMigrationErrors = [];
    forEach(checkMigrationErrorCodes, (code) => {
      checkMigrationErrors.push(
        this.$translate.instant(`email_tab_modal_migrate_errors_check_${code}`),
      );
    });
    this.checkMigrationErrors = uniq(checkMigrationErrors);

    let shouldRetryLabel = '';
    if (shouldRetry) {
      shouldRetryLabel = this.$translate.instant(
        'email_tab_modal_migrate_error_check_should_retry',
      );
    }

    this.checkMigrationErrorLabel = this.$translate.instant(
      'email_tab_modal_migrate_errors_check_label',
      { t0: shouldRetryLabel },
    );
    if (this.checkMigrationErrors.length === 1) {
      this.checkMigrationErrorLabel = this.$translate.instant(
        'email_tab_modal_migrate_error_check_label',
        { t0: shouldRetryLabel },
      );
    }

    this.shouldDisplayCheckMigrationsErrors = true;
  }
}
