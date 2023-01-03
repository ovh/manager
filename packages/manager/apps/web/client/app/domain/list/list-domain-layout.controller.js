import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  DOMAIN_STATUS,
  DOMAIN_TECH_STATE,
  DOMAIN_NAME_SERVER_TYPE,
} from './list-domain-layout.constants';

export default class ListDomainLayoutCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService, coreURLBuilder) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.DOMAIN_STATUS = DOMAIN_STATUS;
    this.DOMAIN_TECH_STATE = DOMAIN_TECH_STATE;
    this.DOMAIN_NAME_SERVER_TYPE = DOMAIN_NAME_SERVER_TYPE;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    super.$onInit();
    this.datagridId = 'datagridDomain';
    this.defaultFilterColumn = 'domain';
  }

  linkContactBuilder({ domain, whoisOwner }) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/contact/${domain}/${whoisOwner}`,
    );
  }
}
