import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
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

  editDescription() {
    return this.editDetails({
      contextTitle: 'dedicatedCloud_description',
      productId: this.currentService.serviceName,
      destinationId: 'dedicatedCloud',
      successText: this.$translate.instant(
        'dedicatedCloud_dashboard_nameModifying_success',
      ),
      value: this.currentService.description,
    }).result.then((newDescription) => {
      this.bindings.description = newDescription;
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
