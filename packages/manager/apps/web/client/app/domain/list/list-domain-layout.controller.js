import punycode from 'punycode';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import {
  DOMAIN_OBJECT_KEYS,
  DOMAIN_STATUS,
  DOMAIN_SUSPENSION_STATE,
  DOMAIN_NAME_SERVER_TYPE,
  DOMAIN_TRANSFERT_LOCK_STATE,
  DOMAINS_BADGES_STATUS,
  DOMAINS_BADGES_SUSPENSION_STATE,
  DOMAINS_BADGES_TRANSFERT_LOCK_STATE,
  DOMAIN_RENEWAL_MODE,
  DOMAINS_BADGES_RENEWAL_MODE,
  IDN_PREFIX,
  DOMAIN_RENEWABLE_STATE,
  MONTH_DATE_FORMAT,
  DATE_FORMAT,
  LANGUAGE_OVERRIDE,
} from './list-domain-layout.constants';

export default class ListDomainLayoutCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
    coreURLBuilder,
    coreConfig,
    Domain,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.DOMAIN_STATUS = DOMAIN_STATUS;
    this.DOMAIN_RENEWABLE_STATE = DOMAIN_RENEWABLE_STATE;
    this.DOMAIN_SUSPENSION_STATE = DOMAIN_SUSPENSION_STATE;
    this.DOMAIN_NAME_SERVER_TYPE = DOMAIN_NAME_SERVER_TYPE;
    this.DOMAIN_TRANSFERT_LOCK_STATE = DOMAIN_TRANSFERT_LOCK_STATE;
    this.DOMAINS_BADGES_STATUS = DOMAINS_BADGES_STATUS;
    this.DOMAIN_RENEWAL_MODE = DOMAIN_RENEWAL_MODE;
    this.DOMAINS_BADGES_RENEWAL_MODE = DOMAINS_BADGES_RENEWAL_MODE;
    this.DOMAINS_BADGES_SUSPENSION_STATE = DOMAINS_BADGES_SUSPENSION_STATE;
    this.DOMAINS_BADGES_TRANSFERT_LOCK_STATE = DOMAINS_BADGES_TRANSFERT_LOCK_STATE;
    this.IDN_PREFIX = IDN_PREFIX;
    this.DOMAIN_OBJECT_KEYS = DOMAIN_OBJECT_KEYS;
    this.coreURLBuilder = coreURLBuilder;
    this.user = coreConfig.getUser();
    this.Domain = Domain;
  }

  $onInit() {
    super.$onInit();
    this.datagridId = 'datagridDomain';
    this.defaultFilterColumn = 'domain';
    this.contactPopover = {
      rowIndex: -1,
      data: null,
    };

    this.columnsConfig = [
      { name: 'domain', sortable: this.getSorting('domain') },
      { name: 'state', sortable: this.getSorting('state') },
      { name: 'suspensionState', sortable: this.getSorting('suspensionState') },
      { name: 'renewalState', sortable: this.getSorting('renewalState') },
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

    this.domainRenewalModeColumnOptions = {
      hideOperators: true,
      values: this.domainRenewalModeEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(`domains_renewal_mode_${status}`),
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

    this.CANCEL_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/billing/autorenew/delete?serviceId=`,
    );

    this.ENABLE_AUTO_RENEW_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/billing/autorenew/enable?selectedType=DOMAIN&services=`,
    );

    this.DISABLE_AUTO_RENEW_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/billing/autorenew/disable?selectedType=DOMAIN&services=`,
    );
  }

  getDate(domain, key) {
    if (!domain[key]) {
      return '';
    }

    const date = new Date(domain[key]);
    const { ovhSubsidiary } = this.user;
    const locale = LANGUAGE_OVERRIDE[ovhSubsidiary]
      ? LANGUAGE_OVERRIDE[ovhSubsidiary]
      : ovhSubsidiary.toLowerCase();

    if (
      key === this.DOMAIN_OBJECT_KEYS.RENEWAL_DATE &&
      domain[this.DOMAIN_OBJECT_KEYS.RENEWAL_STATE] ===
        this.DOMAIN_RENEWAL_MODE.AUTOMATIC_RENEW
    ) {
      const formattedDate = new Intl.DateTimeFormat(
        locale,
        MONTH_DATE_FORMAT,
      ).format(date);

      return this.$translate.instant('domains_renewal_date_before', {
        date: formattedDate,
      });
    }

    return new Intl.DateTimeFormat(locale, DATE_FORMAT).format(date);
  }

  loadPage() {
    return this.$q.resolve({
      data: this.resources?.data,
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  getContactDetails(contactId, index) {
    this.Domain.getContactInfo(contactId).then((contact) => {
      this.contactPopover.data = contact;
      this.contactPopover.rowIndex = index;
    });
  }

  linkUserAccountBuilder(contactId) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/useraccount/infos/${contactId}`,
    );
  }

  static isDomainRenewableOrRestorable(domain) {
    return (
      ![
        DOMAIN_STATUS.PENDING_INCOMING_TRANSFER,
        DOMAIN_STATUS.DELETED,
        DOMAIN_STATUS.PENDING_CREATE,
      ].includes(domain.state) &&
      domain.renewalState !== DOMAIN_RENEWABLE_STATE.CANCELLATION_REQUESTED
    );
  }

  static isDomainCancellable(domain) {
    return ![
      DOMAIN_STATUS.PENDING_INCOMING_TRANSFER,
      DOMAIN_STATUS.DELETED,
      DOMAIN_STATUS.PENDING_CREATE,
      DOMAIN_STATUS.DISPUTE,
      DOMAIN_STATUS.RESTORABLE,
    ].includes(domain.state);
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
