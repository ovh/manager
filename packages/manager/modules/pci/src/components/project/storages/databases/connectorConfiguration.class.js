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
      const groupNameInArray = field.group ? field.group : EMPTY_GROUP_NAME;
      if (!this.groupsData.find((group) => group.name === groupNameInArray)) {
        this.groupsData.push({
          name: groupNameInArray,
          required: false,
        });
      }
      if (field.required) {
        this.groupsData.find(
          (group) => group.name === groupNameInArray,
        ).required = true;
      }
    });
  }

  getGroups() {
    return this.groupsData;
  }

  getFields(group) {
    return this.rawData[group === EMPTY_GROUP_NAME ? '' : group];
  }
}
