import controller from './domain-dns-modify.controller';
import template from './domain-dns-modify.html';
import { componentName } from './domain-dns-modify.state';

const domainDnsModifyComponent = {
  name: componentName,
  template,
  controller,
  bindings: {
    modifiedDnsList: '<',
    goBack: '<',
  },
};

export default domainDnsModifyComponent;
