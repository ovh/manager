export default class PciOrderCommandTerraformCtrl {
  $onInit() {
    this.terraformDisplay = this.formatTerraformNode(this.terraformData);
  }

  formatTerraformNode(node, identationCount = 0) {
    let keyStr = '';
    // handle key value
    if (node.key === 'resource') {
      keyStr = `${node.key} ${node.values
        .map((value) => `"${value}"`)
        .join(' ')}`;
    } else if (node.values.length > 0) {
      keyStr = `${node.key} = ${node.values
        .map((value) => (typeof value === 'string' ? `"${value}"` : value))
        .join(' ')}`;
    } else {
      keyStr = `${node.key}`;
    }
    // handle sub nodes
    if (node.nodes.length > 0) {
      return `${PciOrderCommandTerraformCtrl.getIdentationString(
        identationCount,
      )}${keyStr} {
${node.nodes
  .map((subnode) => `${this.formatTerraformNode(subnode, identationCount + 1)}`)
  .join(`\r\n`)}
${PciOrderCommandTerraformCtrl.getIdentationString(identationCount)}}`;
    }
    return `${PciOrderCommandTerraformCtrl.getIdentationString(
      identationCount,
    )}${keyStr}`;
  }

  static getIdentationString(ident) {
    let identationStr = '';
    const initialIdentationString = '  ';
    for (let i = 0; i < ident; i += 1) {
      identationStr += initialIdentationString;
    }
    return identationStr;
  }
}
