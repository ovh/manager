import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default class {
  /* @ngInject */
  constructor($stateParams, $translate, $uibModal) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.bindings = {
      accessPolicy: this.buildAccessPolicy(),
      commercialRange: this.currentService.commercialRange,
      description: this.currentService.description,
      numberOfIPBlocks: {
        arin: this.currentService.ipArinCount,
        ripe: this.currentService.ipRipeCount,
        total: this.currentService.ips.length,
      },
      location: this.currentService.location,
      numberOfDatacenters: this.currentService.datacenterCount,
      serviceName: this.currentService.name,
      softwareSolution: this.buildSoftwareSolution(),
      urls: {
        vScope: this.currentService.vScopeUrl,
        webInterface: this.currentService.webInterfaceUrl,
      },
      updateAvailable:
        this.currentService.isMinorSolutionUpdateAvailable() ||
        this.currentService.isMajorSolutionUpdateAvailable(),
      version: this.currentService.version,
    };
  }

  openModalToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            successText: this.$translate.instant(
              'dedicatedCloud_dashboard_nameModifying_success',
            ),
            value: this.currentService.description,
          }),
        },
        templateUrl: 'components/name-edition/name-edition.html',
      })
      .result.then((description) => {
        this.bindings.description = description;
      });
  }

  buildAccessPolicy() {
    const policy = this.currentService.userAccessPolicy;
    const policyIsConfigured = isString(policy) && !isEmpty(policy);

    return this.$translate.instant(
      policyIsConfigured
        ? `ovhManagerPccDashboardGeneralInformation_accessPolicy_definition_${policy.toUpperCase()}`
        : 'ovhManagerPccDashboardGeneralInformation_accessPolicy_definition_NOT_CONFIGURED',
    );
  }

  buildSoftwareSolution() {
    const solution = {
      displayName: this.$translate.instant(
        `ovhManagerPccDashboardGeneralInformation_softwareSolution_definition_displayName_${this.currentService.solution.toUpperCase()}`,
      ),
      displayVersionNumber: get(this.currentService.version, 'major', ''),
      displayBuildNumber: get(this.currentService.version, 'build', ''),
    };

    return solution.displayBuildNumber
      ? `${solution.displayName} ${solution.displayVersionNumber} - build ${solution.displayBuildNumber}`.trim()
      : `${solution.displayName} ${solution.displayVersionNumber}`.trim();
  }
}
