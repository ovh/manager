export default class ConnectorFieldConfiguration {
  constructor({
    defaultValue,
    description,
    displayName,
    group,
    importance,
    name,
    required,
    values,
    type,
  }) {
    this.updateData({
      defaultValue,
      description,
      displayName,
      group,
      importance,
      name,
      required,
      values,
      type,
    });
  }

  updateData({
    defaultValue,
    description,
    displayName,
    group,
    importance,
    name,
    required,
    values,
    type,
  }) {
    Object.assign(this, {
      defaultValue,
      description,
      displayName,
      group,
      importance,
      name,
      required,
      values,
      type,
    });
  }
}
