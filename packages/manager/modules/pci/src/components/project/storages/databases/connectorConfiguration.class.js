import { groupBy } from 'lodash';
import ConnectorFieldConfiguration from './connectorFieldConfiguration.class';

const EMPTY_GROUP_NAME = 'Other';
export default class ConnectorConfiguration {
  constructor(configuration, transformConfiguration) {
    // save configuration as an array of groups
    this.transformConfiguration = groupBy(
      transformConfiguration,
      'transformType',
    );
    this.rawData = configuration;
    this.mappedConfig = groupBy(
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
    return this.mappedConfig[group === EMPTY_GROUP_NAME ? '' : group];
  }

  getField(field) {
    return this.rawData.find((input) => input.name === field);
  }

  getTransformFields(type) {
    return this.transformConfiguration[type];
  }

  isExtra(field) {
    const isFieldInConfig = this.getField(field);
    const isFieldTransform = field.startsWith('transform');
    return !(isFieldInConfig || isFieldTransform);
  }
}
