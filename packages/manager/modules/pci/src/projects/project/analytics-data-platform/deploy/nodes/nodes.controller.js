import set from 'lodash/set';

export default class {
  /**
   * returns the flavor family for the given instance type
   *
   * @param {*} instanceType the instance type
   * @returns the flavor family (string)
   */
  static getFlavorFamily(instanceType) {
    return instanceType.flavorFamily;
  }

  static onInstanceSelect(instance, node) {
    const isValid = instance.disk >= node.rawStorageMinGb;
    set(node, 'isValid', isValid);
  }
}
