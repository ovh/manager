import punycode from 'punycode';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import {
  DOMAIN_STATUS,
  DOMAIN_SUSPENSION_STATE,
  DOMAIN_NAME_SERVER_TYPE,
  DOMAIN_TRANSFERT_LOCK_STATE,
  DOMAINS_BADGES_STATUS,
  DOMAINS_BADGES_SUSPENSION_STATE,
  DOMAINS_BADGES_TRANSFERT_LOCK_STATE,
  IDN_PREFIX,
} from './list-domain-layout.constants';

export default class ListDomainLayoutCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService, coreURLBuilder) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.DOMAIN_STATUS = DOMAIN_STATUS;
    this.DOMAIN_SUSPENSION_STATE = DOMAIN_SUSPENSION_STATE;
    this.DOMAIN_NAME_SERVER_TYPE = DOMAIN_NAME_SERVER_TYPE;
    this.DOMAIN_TRANSFERT_LOCK_STATE = DOMAIN_TRANSFERT_LOCK_STATE;
    this.DOMAINS_BADGES_STATUS = DOMAINS_BADGES_STATUS;
    this.DOMAINS_BADGES_SUSPENSION_STATE = DOMAINS_BADGES_SUSPENSION_STATE;
    this.DOMAINS_BADGES_TRANSFERT_LOCK_STATE = DOMAINS_BADGES_TRANSFERT_LOCK_STATE;
    this.IDN_PREFIX = IDN_PREFIX;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    super.$onInit();
    this.datagridId = 'datagridDomain';
    this.defaultFilterColumn = 'domain';

    this.columnsConfig = [
      { name: 'domain', sortable: this.getSorting('domain') },
      { name: 'state', sortable: this.getSorting('state') },
      { name: 'suspensionState', sortable: this.getSorting('suspensionState') },
      { name: 'whoisOwner', sortable: this.getSorting('whoisOwner') },
      { name: 'nameServerType', sortable: this.getSorting('nameServerType') },
    ];

    this.domainStateColumnOptions = {
      hideOperators: true,
      values: this.domainStateEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(`domains_status_${status}`),
        }),
        {},
      ),
    };

    this.domainSuspensionStateColumnOptions = {
      hideOperators: true,
      values: this.domainSuspensionStateEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `domains_suspension_state_${status}`,
          ),
        }),
        {},
      ),
    };

    this.domainNameServerTypeColumnOptions = {
      hideOperators: true,
      values: this.domainNsTypeEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(`domains_dns_type_${status}`),
        }),
        {},
      ),
    };
  }

  loadPage() {
    return this.$q.resolve({
      data: this.resources?.data,
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  linkContactBuilder({ domain, whoisOwner }) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/contact/${domain}/${whoisOwner}`,
    );
  }

  onRowSelect(row, rows) {
    this.selectedRows = rows;
  }

  static convertToPunycode(domain) {
    return punycode.toUnicode(domain);
  }

  isIdn(domain) {
    return domain.includes(this.IDN_PREFIX);
  }
}
