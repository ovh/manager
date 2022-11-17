import { TRACKING_PREFIX, LEARN_ORGANIZATION_LINK } from '../list.constant';

export default class IpOrganisationController {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    goToDashboard,
    Ip,
    IpOrganisation,
    Alerter,
    atInternet,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.goToDashboard = goToDashboard;
    this.Ip = Ip;
    this.IpOrganisation = IpOrganisation;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.$scope.alert = 'ip_organisation_alerter';
    this.$scope.loadingOrganisation = false;
    this.$scope.organisations = null;
    this.$scope.LEARN_ORGANIZATION_LINK = LEARN_ORGANIZATION_LINK;
    this.$scope.$on('ips.organisation.display', () => {
      this.$scope.organisations = null;
      this.loadOrganisations();
    });

    return this.loadOrganisations();
  }

  loadOrganisations() {
    this.$scope.organisations = null;
    this.$scope.loadingOrganisation = true;
    return this.IpOrganisation.getIpOrganisation()
      .then((organisations) => {
        this.$scope.organisations = organisations;
      })
      .catch((data) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('ip_organisation_load_error'),
          data.data,
          this.$scope.alert,
        );
      })
      .finally(() => {
        this.$scope.loadingOrganisation = false;
      });
  }

  goToUpdateOrganisation(organisation) {
    this.trackClickAndPage('update');
    this.$scope.setAction(
      'ip/organisation/add-or-edit/ip-ip-organisation-add-or-edit',
      organisation,
    );
  }

  goToAddOrganisation() {
    this.trackClickAndPage('add');
    this.$scope.setAction(
      'ip/organisation/add-or-edit/ip-ip-organisation-add-or-edit',
    );
  }

  trackClickAndPage(key) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::organisation::${key}`,
      type: 'action',
    });
    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}::organisation::${key}`,
    });
  }
}
