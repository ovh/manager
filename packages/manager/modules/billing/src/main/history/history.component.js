import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './billing-main-history.controller';
import template from './billing-main-history.html';

export default {
  bindings: {
    getBills: '<',
    currentUser: '<',
    debtAccount: '<',
    exportBills: '<',
    getDebt: '<',
    hasDefaultPaymentMethod: '<',
    invoicesByPostalMail: '<',
    isHtmlInvoiceAvailable: '<',
    payDebt: '<',
    seeDebt: '<',
    ...ListLayoutHelper.componentBindings,
  },
  controller,
  template,
};
