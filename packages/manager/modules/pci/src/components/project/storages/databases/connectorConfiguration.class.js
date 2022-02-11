import { groupBy } from 'lodash';
import ConnectorFieldConfiguration from './connectorFieldConfiguration.class';

const EMPTY_GROUP_NAME = 'Other';
export default class ConnectorConfiguration {
  constructor(configuration) {
    // save configuration as an array of groups
    this.rawData = groupBy(
      configuration.map((field) => new ConnectorFieldConfiguration(field)),
      'group',
    );
    // save groups informations
    this.groupsData = [];
    configuration.forEach((field) => {
      if (field.group) {
        if (!this.groupsData.find((group) => group.name === field.group)) {
          this.groupsData.push({
            name: field.group,
            required: false,
          });
        }
        if (field.required) {
          this.groupsData.find(
            (group) => group.name === field.group,
          ).required = true;
        }
      }
    });
    // group without name is "Other" group and should be placed at the end of the list
    const otherGroupFields = configuration.filter((field) => !field.group);
    if (otherGroupFields) {
      this.groupsData.push({
        name: EMPTY_GROUP_NAME,
        required:
          otherGroupFields.filter((field) => field.required).length !== 0,
      });
    }
  }

  getGroups() {
    return this.groupsData;
  }

  getFields(group) {
    return this.rawData[group === EMPTY_GROUP_NAME ? '' : group];
  }
}
