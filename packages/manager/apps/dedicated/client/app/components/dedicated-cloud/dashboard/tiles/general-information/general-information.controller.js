export default class {
  /* @ngInject */
  constructor($scope, $translate, DedicatedCloud, Alerter, coreURLBuilder) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.Alerter = Alerter;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.bindings = {
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
    if (this.vcdMigrationState?.vcdName) {
      this.vcdDashboardRedirectURL = this.coreURLBuilder.buildURL(
        'hpc-vmware-managed-vcd',
        `#/${this.vcdMigrationState.vcdName}`,
      );
    }

    this.isLoading = false;
    return this.loadLocation();
  }

  loadLocation() {
    this.isLoading = true;
    return this.DedicatedCloud.getLocation(this.currentService.serviceName)
      .then((locationInfo) => {
        this.locationInfo = locationInfo;
      })
      .catch((error) => {
        const errorMessage = error.data?.message || error.data;
        this.Alerter.error(
          [
            this.$translate.instant(
              'ovhManagerPccDashboardGeneralInformation_loadLocation_error',
            ),
            errorMessage ? `(${errorMessage})` : '',
          ].join(' '),
          'dedicatedCloud',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
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

  buildSoftwareSolution() {
    const solution = {
      displayName: this.$translate.instant(
        `ovhManagerPccDashboardGeneralInformation_softwareSolution_definition_displayName_${this.currentService.solution.toUpperCase()}`,
      ),
      displayMajorVersionNumber: this.currentService?.version?.major || '',
      displayMinorVersionNumber: this.currentService?.version?.minor || '',
      displayBuildNumber: this.currentService?.version?.build || '',
    };

    return solution.displayBuildNumber
      ? `${solution.displayName} ${solution.displayMajorVersionNumber} ${solution.displayMinorVersionNumber} (build ${solution.displayBuildNumber})`.trim()
      : `${solution.displayName} ${solution.displayMajorVersionNumber} ${solution.displayMinorVersionNumber}`.trim();
  }
}
