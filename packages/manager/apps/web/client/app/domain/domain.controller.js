import filter from 'lodash/filter';
import get from 'lodash/get';

angular.module('App').controller(
  'DomainCtrl',
  class DomainCtrl {
    constructor(
      $q,
      $rootScope,
      $scope,
      $state,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      constants,
      Domain,
      associatedHostings,
      goToWebhostingOrder,
      hasEmailDomain,
      isEmailDomainAvailable,
      Hosting,
      orderedHosting,
      User,
      WucAllDom,
      zoneCapabilities,
    ) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.constants = constants;
      this.Domain = Domain;
      this.associatedHostings = associatedHostings;
      this.goToWebhostingOrder = goToWebhostingOrder;
      this.isEmailDomainTabAvailable = isEmailDomainAvailable && hasEmailDomain;
      this.Hosting = Hosting;
      this.orderedHosting = orderedHosting;
      this.User = User;
      this.WucAllDom = WucAllDom;
      this.zoneCapabilities = zoneCapabilities;
    }

    $onInit() {
      this.canOrderHosting = false;
      this.domain = null;
      this.isAllDom = this.$rootScope.currentSectionInformation === 'all_dom';
      this.hasZoneDns = false;
      this.loading = {
        domainInfos: true,
      };
      this.stepPath = '';

      this.$scope.alerts = {
        page: 'domain_alert_page',
        tabs: 'domain_alert_tabs',
        main: 'domain_alert_main',
      };
      this.$scope.currentAction = null;
      this.$scope.currentActionData = null;

      this.$scope.resetAction = () => this.$scope.setAction(false);

      this.$scope.setAction = (action, data) => {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;

        if (action) {
          this.stepPath = `domain/${this.$scope.currentAction}.html`;
          $('#currentAction').modal({
            keyboard: true,
            backdrop: 'static',
          });
        } else {
          $('#currentAction').modal('hide');
          this.$scope.currentActionData = null;
          this.$timeout(() => {
            this.stepPath = '';
          }, 300);
        }
      };

      this.$scope.$on('domain.dashboard.refresh', () =>
        this.reloadDomain(true),
      );
      this.$scope.$on('$locationChangeStart', () => this.$scope.resetAction());
      this.$scope.$on('transfertLock.get.done', (e, infos) => {
        this.domain.protection = infos.transferLockStatus;
      });
      this.$scope.$on('$destroy', () => this.Domain.killDomainPolling());

      return this.$q
        .all({
          user: this.User.getUser(),
          domain: this.Domain.getServiceInfo(this.$stateParams.productId),
          allDom: this.isAllDom
            ? this.WucAllDom.getServiceInfos(this.$stateParams.allDom)
            : null,
        })
        .then(({ user, domain, allDom }) => {
          this.isAdminOrBilling =
            domain.contactAdmin === user.nichandle ||
            domain.contactBilling === user.nichandle;
          this.domainInfos = domain;
          const alldomOrder = get(
            this.constants,
            `urls.${user.ovhSubsidiary}.alldomOrder`,
          );
          this.alldomURL =
            !this.isAllDom && alldomOrder && `${alldomOrder}${domain.domain}`;

          if (this.isAllDom) {
            this.allDom = this.$stateParams.allDom;
            this.allDomInfos = allDom;
          }
          this.getGuides(user.ovhSubsidiary);
        })
        .catch(() => {
          this.isAdminOrBilling = false;
        })
        .finally(() => this.loadDomain());
    }

    getGuides(subsidiary) {
      this.autorenewGuide = get(
        this.constants,
        `urls.${subsidiary}.guides.autoRenew`,
        get(this.constants, `urls.FR.guides.autoRenew`),
      );
      this.autorenewUrl = `${this.constants.AUTORENEW_URL}?selectedType=DOMAIN&searchText=${this.domainInfos.domain}`;
    }

    loadDomain() {
      return this.Domain.getSelected(this.$stateParams.productId, true)
        .then((domain) => {
          this.domain = domain;

          // translation key like: "domain_configuration_dnssec_" +
          // domain.dnssecStatus > DNSSEC is not activated.
          if (!domain.dnssecStatus) {
            this.domain.dnssecStatus = 'DISABLED';
          }

          if (/IN_PROGRESS/.test(domain.dnssecStatus)) {
            this.Domain.pollDnsSec(
              domain.name,
              domain.dnssecStatus === 'ENABLE_IN_PROGRESS',
            );
          }

          if (/locking|unlocking/.test(domain.protection)) {
            this.Domain.pollTransfertLock(
              domain.name,
              domain.protection === 'locking',
            );
          }

          if (domain.messages.length > 0) {
            const messages = domain.isExpired
              ? filter(
                  domain.messages,
                  (message) =>
                    !/service(\s\w+\s)?expired/i.test(message.message),
                )
              : domain.messages;

            if (messages.length > 0) {
              this.Alerter.alertFromSWS(
                this.$translate.instant('domain_dashboard_loading_error'),
                { state: 'ERROR', messages },
                this.$scope.alerts.page,
              );
            }
          }

          return this.$q.allSettled([
            this.Hosting.getHosting(domain.name, [404])
              .then((data) => {
                this.canOrderHosting = data === null && !this.orderedHosting;
              })
              .catch(() => {
                this.canOrderHosting = false;
              }),

            // load the dns zones in order to display or hide the dynhost tab
            // we set recordCount to 1 since we only want to know if it exists one or more dns zones
            this.Domain.getTabZoneDns(domain.name, 1)
              .then((tabZone) => {
                this.hasZoneDns = !!tabZone;
              })
              .catch(() => {
                this.hasZoneDns = false;
              }),

            // get the status of the zone to display a notification
            // icon on the zone tab if there are errors
            this.Domain.getZoneStatus(domain.name)
              .then((data) => {
                this.zoneStatus = data || { errors: [], warnings: [] };
              })
              .catch(() => {
                this.zoneStatus = { errors: [], warnings: [] };
              }),

            this.Hosting.getHostings().then((hostings) => {
              this.hostings = hostings;
            }),
          ]);
        })
        .catch(() =>
          this.Alerter.error(
            this.$translate.instant('domain_dashboard_loading_error'),
            this.$scope.alerts.page,
          ),
        )
        .finally(() => {
          this.loading.domainInfos = false;
          this.$scope.$broadcast('domain.refreshData.done');
        });
    }

    reloadDomain(transparentReload) {
      if (!transparentReload) {
        this.loading.domainInfos = true;
        this.Alerter.resetMessage(this.$scope.alerts.page);
      }

      return this.loadDomain();
    }

    getState() {
      return this.isAllDom ? 'app.domain.alldom' : 'app.domain.product';
    }
  },
);
