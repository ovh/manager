export default class ConnectorFieldConfiguration {
  constructor({
    defaultValue,
    description,
    displayName,
    group,
    importance,
    name,
    required,
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
      type: displayName === 'Transforms' ? 'transform' : type,
    });
  }
}
