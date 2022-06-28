export default class {
  $onInit() {
    this.integrationTypes = this.integrations
      .reduce((integrationsByType, integration) => {
        const integrationType = integrationsByType.find(
          ({ type }) => type === integration.type,
        );
        if (integrationType) {
          integrationType.count += 1;
        } else {
          integrationsByType.push({
            type: integration.type,
            count: 1,
          });
        }
        return integrationsByType;
      }, [])
      .sort((a, b) => a.type.localeCompare(b.type));
  }
}
