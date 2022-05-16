import { isEqual } from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard(
      `service_integration::add_${this.database.engine}`,
      'page',
    );
    this.showNoServiceMessage = false;
    this.isDisabledSourceSelect = true;
    this.isDisabledDestinationSelect = true;
    this.parameters = {};

    // aggregate capabilities so we only have one of each type, with an array as source and destination
    // engines
    this.aggregatedIntegrationCapabilities = this.integrationCapabilities.reduce(
      (acc, curr) => {
        const existingCapability = acc.find((c) => c.type === curr.type);
        if (existingCapability) {
          if (!existingCapability.sourceEngines.includes(curr.sourceEngine)) {
            existingCapability.sourceEngines.push(curr.sourceEngine);
          }
          if (
            !existingCapability.destinationEngines.includes(
              curr.destinationEngine,
            )
          ) {
            existingCapability.destinationEngines.push(curr.destinationEngine);
          }
        } else {
          const capabilityArray = {
            type: curr.type,
            parameters: curr.parameters,
            sourceEngines: [curr.sourceEngine],
            destinationEngines: [curr.destinationEngine],
          };
          acc.push(capabilityArray);
        }
        return acc;
      },
      [],
    );
  }

  cancel() {
    this.trackDashboard(
      `service_integration::add_${this.database.engine}_cancel`,
    );
    this.goBack();
  }

  handleIntegrationChange() {
    const { sourceEngines, destinationEngines } = this.integrationCapability;
    // Filter services list according to integration capability
    if (sourceEngines === destinationEngines) {
      const filteredServices = this.servicesList.filter((db) =>
        sourceEngines.includes(db.engine),
      );
      this.sourceServiceList = filteredServices;
      this.destinationServiceList = filteredServices;
    } else {
      this.sourceServiceList =
        isEqual(sourceEngines, [this.database.engine]) &&
        !destinationEngines.includes(this.database.engine)
          ? [this.database]
          : this.servicesList.filter((db) => sourceEngines.includes(db.engine));
      this.destinationServiceList =
        isEqual(destinationEngines, [this.database.engine]) &&
        !sourceEngines.includes(this.database.engine)
          ? [this.database]
          : this.servicesList.filter((db) =>
              destinationEngines.includes(db.engine),
            );
    }
    // Preselect service if only one element
    this.sourceService =
      this.sourceServiceList.length === 1 ? this.sourceServiceList[0] : null;
    this.destinationService =
      this.destinationServiceList.length === 1
        ? this.destinationServiceList[0]
        : null;
    // Emtpy parameters array
    this.parameters = {};
    // Disable select inputs if needed
    const isServiceSourceListEmpty = this.sourceServiceList.length === 0;
    const isCurrentEngineInSourceList = sourceEngines.includes(
      this.database.engine,
    );
    const isServiceDestinationListEmpty =
      this.destinationServiceList.length === 0;
    const isCurrentEngineInDestinationList = destinationEngines.includes(
      this.database.engine,
    );
    // Disable select input if needed
    this.isDisabledSourceSelect =
      isServiceSourceListEmpty ||
      (isCurrentEngineInSourceList && !isCurrentEngineInDestinationList);
    this.isDisabledDestinationSelect =
      isServiceDestinationListEmpty ||
      (isCurrentEngineInDestinationList && !isCurrentEngineInSourceList);
    // Check if preselected data is valid
    this.checkIntegrationValidity();
  }

  checkIntegrationValidity() {
    // We can not add twice the same integration
    this.existingIntegrationError =
      this.serviceIntegrationList.filter(
        (existingIntegration) =>
          existingIntegration.type === this.integrationCapability?.type &&
          existingIntegration.sourceServiceId === this.sourceService?.id &&
          existingIntegration.destinationServiceId ===
            this.destinationService?.id,
      ).length > 0;
    // We have to select the current service as either source or destination
    this.notCurrentServiceSelectedError =
      this.sourceService?.id !== this.database.id &&
      this.destinationService?.id !== this.database.id;
    // Show a message if no service matches the selected integration type
    this.showNoServiceMessage =
      this.sourceServiceList.length === 0 ||
      this.destinationServiceList.length === 0;
    // List of expected engines to add for current integration type
    this.expectedEngines =
      this.sourceServiceList.length === 0
        ? this.integrationCapability.sourceEngines
        : this.integrationCapability.destinationEngines;
  }

  formatParameters() {
    // Do not post parameter property at all if no parameter
    if (Object.keys(this.parameters).length === 0) {
      return undefined;
    }
    // API only accepts string values
    const formatedParameters = {};
    Object.keys(this.parameters).forEach((parameterName) => {
      formatedParameters[parameterName] = this.parameters[
        parameterName
      ].toString();
    });
    return formatedParameters;
  }

  addServiceIntegration() {
    this.processing = true;
    this.trackDashboard(
      `service_integration::add_${this.database.engine}_confirm`,
    );
    return this.DatabaseService.addIntegration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.sourceService.id,
      this.destinationService.id,
      this.integrationCapability.type,
      this.formatParameters(),
    )
      .then(() => {
        this.trackDashboard(
          `service_integration::add_${this.database.engine}_validate_banner`,
          'page',
        );
        return this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_add_success_message',
            {
              integrationType: this.integrationCapability.type,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackDashboard(
          `service_integration::add_${this.database.engine}_error_banner`,
          'page',
        );
        return this.goBack(
          this.$translate.instant(
            'pci_databases_service_integration_add_error_message',
            {
              integrationType: this.integrationCapability.type,
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
