import DnsFormController from './add-dns-form.controller';
import template from './add-dns-form.html';

const addDnsFormComponent = {
  template,
  controller: DnsFormController,
  bindings: {
    modifiedDnsList: '<',
    minDnsSize: '<',
    configurationType: '<',
    nameServer: '<',
    ip: '<',
    onSubmit: '&',
    shouldClearForm: '=',
  },
};

export default addDnsFormComponent;
