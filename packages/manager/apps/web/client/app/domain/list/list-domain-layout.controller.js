import punycode from 'punycode';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import {
  DOMAIN_COLUMN_DNSSEC,
  DOMAIN_OBJECT_KEYS,
  DOMAIN_STATUS,
  DOMAIN_SUSPENSION_STATE,
  DOMAIN_SUSPENSION_STATE_CLASS,
  DOMAIN_NAME_SERVER_TYPE,
  DOMAIN_TRANSFER_LOCK_STATE,
  DOMAIN_TRANSFER_LOCK_STATE_CLASS,
  DOMAIN_DNSSEC_STATE,
  DOMAIN_DNSSEC_STATE_CLASS,
  DOMAINS_BADGES_STATUS,
  DOMAIN_RENEWAL_MODE,
  DOMAINS_BADGES_RENEWAL_MODE,
  IDN_PREFIX,
  DOMAIN_RENEWABLE_STATE,
  MONTH_DATE_FORMAT,
  DATE_FORMAT,
  LANGUAGE_OVERRIDE,
  PRODUCT_TYPE,
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
    $scope,
    $timeout,
    $window,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.DOMAIN_COLUMN_DNSSEC = DOMAIN_COLUMN_DNSSEC;
    this.DOMAIN_STATUS = DOMAIN_STATUS;
    this.DOMAIN_RENEWABLE_STATE = DOMAIN_RENEWABLE_STATE;
    this.DOMAIN_SUSPENSION_STATE = DOMAIN_SUSPENSION_STATE;
    this.DOMAIN_SUSPENSION_STATE_CLASS = DOMAIN_SUSPENSION_STATE_CLASS;
    this.DOMAIN_NAME_SERVER_TYPE = DOMAIN_NAME_SERVER_TYPE;
    this.DOMAIN_TRANSFER_LOCK_STATE = DOMAIN_TRANSFER_LOCK_STATE;
    this.DOMAIN_TRANSFER_LOCK_STATE_CLASS = DOMAIN_TRANSFER_LOCK_STATE_CLASS;
    this.DOMAIN_DNSSEC_STATE = DOMAIN_DNSSEC_STATE;
    this.DOMAIN_DNSSEC_STATE_CLASS = DOMAIN_DNSSEC_STATE_CLASS;
    this.DOMAINS_BADGES_STATUS = DOMAINS_BADGES_STATUS;
    this.DOMAIN_RENEWAL_MODE = DOMAIN_RENEWAL_MODE;
    this.DOMAINS_BADGES_RENEWAL_MODE = DOMAINS_BADGES_RENEWAL_MODE;
    this.IDN_PREFIX = IDN_PREFIX;
    this.DOMAIN_OBJECT_KEYS = DOMAIN_OBJECT_KEYS;
    this.coreURLBuilder = coreURLBuilder;
    this.user = coreConfig.getUser();
    this.Domain = Domain;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$window = $window;
  }

  $onInit() {
    super.$onInit();
    this.datagridId = 'datagridDomain';
    this.defaultFilterColumn = 'domain';
    this.contactPopover = {
      rowIndex: -1,
      data: null,
    };

    this.currentAction = null;
    this.currentActionData = null;
    this.stepPath = '';
    this.loading = {
      domainsExportCsv: false,
    };

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
      '#/billing/autorenew/delete?serviceId=',
    );

    this.ENABLE_AUTO_RENEW_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/autorenew/enable?selectedType=DOMAIN&services=',
    );

    this.DISABLE_AUTO_RENEW_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/autorenew/disable?selectedType=DOMAIN&services=',
    );

    this.USER_ACCOUNT_INFOS_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/infos',
    );

    this.setActionMultiple = (action, data) =>
      this.setAction(action, 'domain/list/', data);
    this.$scope.resetAction = () => this.setAction(false);
    this.$scope.$on('domain.csv.export.cancel', () => {
      this.loading.domainsExportCsv = false;
    });
    this.$scope.$on('domain.csv.export.doing', () => {
      this.loading.domainsExportCsv = true;
    });
    this.$scope.$on('domain.csv.export.done', () => {
      this.loading.domainsExportCsv = false;
    });
    this.$scope.$on('domain.csv.export.error', () => {
      this.loading.domainsExportCsv = false;
    });
  }

  goToContactManagementEdit(domain) {
    this.$window.top.location.href = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/contacts/services/edit',
      {
        serviceName: domain,
        category: PRODUCT_TYPE,
        service: domain,
        categoryType: PRODUCT_TYPE,
      },
    );
  }

  setAction(action, baseStepPath, data) {
    this.$scope.currentAction = action;
    this.$scope.currentActionData = data;

    if (action) {
      this.stepPath = `${baseStepPath}${this.$scope.currentAction}.html`;
      $('#currentAction').modal({ keyboard: true, backdrop: 'static' });
    } else {
      $('#currentAction').modal('hide');
      this.$scope.currentActionData = null;
      this.$timeout(() => {
        this.stepPath = '';
      }, 300);
    }
  }

  static getDNSServers(nameServers) {
    return nameServers.map((item) => item.nameServer).join(', ');
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

  linkToOwnerPage(ownerId, domain) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/contact/${domain}/${ownerId}`,
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
