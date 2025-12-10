import { ChangelogLinks } from '@ovh-ux/manager-react-components';
import { ParamValueType } from '@ovh-ux/url-builder';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BADGE_COLOR, ICON_NAME } from '@ovhcloud/ods-react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { DashboardTabItemProps } from '@/domain/types/serviceDetail';
import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '../enum/domainState.enum';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import {
  DomainServiceStateEnum,
  BannerResult,
  ComboRule,
  StatusDetails,
  TransferLockStatusEnum,
  DnssecStateEnum,
} from '../types/domainResource';
import { DnssecStatusEnum } from '../enum/dnnecStatus.enum';
import { LifecycleCapacitiesEnum } from '@/common/enum/common.enum';

export const ServiceDetailTabsProps: DashboardTabItemProps[] = [
  {
    id: 'information',
    name: 'domain_tab_name_general_information',
    value: 'information',
  },
  {
    id: 'zone',
    name: 'domain_tab_name_dns_zone',
    value: 'zone',
  },
  {
    id: 'dns',
    name: 'domain_tab_name_dns_server',
    value: 'dns',
  },
  {
    id: 'redirection',
    name: 'domain_tab_name_redirection',
    value: 'redirection',
  },
  {
    id: 'dynhost',
    name: 'domain_tab_name_dynhost',
    value: 'dynhost',
  },
  {
    id: 'hosts',
    name: 'domain_tab_name_host',
    value: 'hosts',
  },
  {
    id: 'ds-records',
    name: 'domain_tab_name_ds_records',
    value: 'ds-records',
  },
  {
    id: 'contact-management',
    name: 'domain_tab_name_contact_management',
    value: 'contact-management',
  },
];

export const legacyTabs = ['zone', 'redirection', 'dynhost'];

export const changelogLinks: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/18/views/2?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  roadmap:
    'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  'feature-request':
    'https://github.com/ovh/hosting-domain-names-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const ongoingOperationLink: [
  string,
  string,
  Record<string, ParamValueType>,
] = ['web-ongoing-operations', '/domain', {}];

export const ERROR_RULES: ComboRule[] = [
  {
    requiresAll: [
      AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
      SuspensionStateEnum.SUSPENDED,
    ],
    result: {
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_technical_suspended',
      link: {
        linkDetails: ongoingOperationLink,
        linki18n:
          'domain_tab_general_information_banner_link_ongoing_operations',
      },
    },
  },
  {
    requiresAll: [
      AdditionalDomainStateEnum.FORCED_DELETION,
      AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
    ],
    result: {
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_forced_delete_technical',
    },
  },
  {
    requiresAll: [
      AdditionalDomainStateEnum.FORCED_DELETION,
      AdditionalDomainStateEnum.OVH_ABUSE,
    ],
    result: {
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_forced_delete_ovh_abuse',
    },
  },
  {
    requiresAll: [
      AdditionalDomainStateEnum.FORCED_DELETION,
      AdditionalDomainStateEnum.DGCCRF_ABUSE,
    ],
    result: {
      type: 'error',
      i18nKey:
        'domain_tab_general_information_banner_forced_delete_dgccrf_abuse',
    },
  },
  {
    requiresAll: [
      AdditionalDomainStateEnum.FORCED_DELETION,
      AdditionalDomainStateEnum.REGISTRY_ABUSE,
    ],
    result: {
      type: 'error',
      i18nKey:
        'domain_tab_general_information_banner_forced_delete_registry_abuse',
    },
  },
];

export const WARNING_RULES: ComboRule[] = [
  {
    requiresAll: [
      AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
      SuspensionStateEnum.NOT_SUSPENDED,
    ],
    result: {
      type: 'warning',
      i18nKey: 'domain_tab_general_information_banner_technical_not_suspended',
      link: {
        linkDetails: ongoingOperationLink,
        linki18n:
          'domain_tab_general_information_banner_link_ongoing_operations',
      },
    },
  },
];

export const DIRECT_FLAGS: Record<string, BannerResult> = {
  [DomainStateEnum.EXPIRED]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_expired_to_delete',
  },
  [DomainStateEnum.TO_DELETE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_expired_to_delete',
  },
  [DomainStateEnum.RESTORABLE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_restorable',
    link: {
      linki18n: `${NAMESPACES.ACTIONS}:restore`,
      orderFunnel: true,
    },
  },
  [AdditionalDomainStateEnum.DISPUTE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_dispute',
  },
  [AdditionalDomainStateEnum.OVH_ABUSE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_abuse',
  },
  [AdditionalDomainStateEnum.DGCCRF_ABUSE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_abuse',
  },
  [AdditionalDomainStateEnum.REGISTRY_ABUSE]: {
    type: 'warning',
    i18nKey: 'domain_tab_general_information_banner_abuse',
  },
};

export const DOMAIN_STATUS: Record<string, StatusDetails> = {
  [DomainStateEnum.OK]: {
    i18nKey: 'domain_tab_general_information_registered',
    statusColor: BADGE_COLOR.success,
  },
  [DomainStateEnum.EXPIRED]: {
    i18nKey: 'domain_tab_general_information_expired',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainStateEnum.RESTORABLE]: {
    i18nKey: 'domain_tab_general_information_restorable',
    statusColor: BADGE_COLOR.warning,
  },
  [DomainStateEnum.PENDING_CREATE]: {
    i18nKey: 'domain_tab_general_information_registration_progress',
    statusColor: BADGE_COLOR.information,
  },
  [DomainStateEnum.PENDING_INTERNAL_TRANSFER]: {
    i18nKey: 'domain_tab_general_information_incoming_transfer',
    statusColor: BADGE_COLOR.information,
  },
  [DomainStateEnum.PENDING_OUTGOING_TRANSFER]: {
    i18nKey: 'domain_tab_general_information_outgoing_transfer',
    statusColor: BADGE_COLOR.information,
  },
  [DomainStateEnum.PENDING_DELETE]: {
    i18nKey: 'domain_tab_general_information_pending_deletion',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainStateEnum.TO_DELETE]: {
    i18nKey: 'domain_tab_general_information_pending_deletion',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainStateEnum.DELETED]: {
    i18nKey: 'domain_tab_general_information_deleted',
    statusColor: BADGE_COLOR.critical,
  },
};

export const SUSPENSION_STATUS: Record<string, StatusDetails> = {
  [SuspensionStateEnum.NOT_SUSPENDED]: {
    i18nKey: 'domain_tab_general_not_suspended',
    statusColor: BADGE_COLOR.success,
  },
  [SuspensionStateEnum.SUSPENDED]: {
    i18nKey: 'domain_tab_general_suspended',
    statusColor: BADGE_COLOR.critical,
  },
};

export const DOMAIN_STATE: Record<string, StatusDetails> = {
  [DomainServiceStateEnum.AUTORENEW_IN_PROGRESS]: {
    i18nKey: 'domain_status_auto_renew_in_progress',
    statusColor: BADGE_COLOR.success,
  },
  [DomainServiceStateEnum.AUTORENEW_REGISTRY_IN_PROGRESS]: {
    i18nKey: 'domain_status_auto_renew_in_progress',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainServiceStateEnum.DELETED]: {
    i18nKey: 'domain_tab_general_information_deleted',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainServiceStateEnum.DISPUTE]: {
    i18nKey: 'domain_tab_general_information_dispute',
    statusColor: BADGE_COLOR.warning,
  },
  [DomainServiceStateEnum.EXPIRED]: {
    i18nKey: 'domain_tab_general_information_expired',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainServiceStateEnum.OK]: {
    i18nKey: 'domain_tab_general_information_registered',
    statusColor: BADGE_COLOR.success,
  },
  [DomainServiceStateEnum.OUTGOING_TRANSFER]: {
    i18nKey: 'domain_tab_general_information_outgoing_transfer',
    statusColor: BADGE_COLOR.information,
  },
  [DomainServiceStateEnum.PENDING_CREATE]: {
    i18nKey: 'domain_tab_general_information_registration_progress',
    statusColor: BADGE_COLOR.information,
  },
  [DomainServiceStateEnum.PENDING_DELETE]: {
    i18nKey: 'domain_tab_general_information_pending_deletion',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainServiceStateEnum.PENDING_INCOMING_TRANSFER]: {
    i18nKey: 'domain_tab_general_information_incoming_transfer',
    statusColor: BADGE_COLOR.information,
  },
  [DomainServiceStateEnum.PENDING_INSTALLATION]: {
    i18nKey: 'domain_status_pending_installation',
    statusColor: BADGE_COLOR.information,
  },
  [DomainServiceStateEnum.REGISTRY_SUSPENDED]: {
    i18nKey: 'domain_status_registry_suspended',
    statusColor: BADGE_COLOR.critical,
  },
  [DomainServiceStateEnum.RESTORABLE]: {
    i18nKey: 'domain_tab_general_information_restorable',
    statusColor: BADGE_COLOR.warning,
  },
  [DomainServiceStateEnum.TECHNICAL_SUSPENDED]: {
    i18nKey: 'domain_status_technical_suspended',
    statusColor: BADGE_COLOR.critical,
  },
};

export const DOMAIN_TRANSFER_LOCK_STATUS: Record<string, StatusDetails> = {
  [TransferLockStatusEnum.LOCKED]: {
    i18nKey: 'domain_tab_general_information_status_enabled',
    statusColor: BADGE_COLOR.success,
    icon: ICON_NAME.lockClose,
  },
  [TransferLockStatusEnum.LOCKING]: {
    i18nKey: 'domain_tab_general_information_status_enabling',
    statusColor: BADGE_COLOR.information,
    icon: ICON_NAME.lockClose,
  },
  [TransferLockStatusEnum.UNAVAILABLE]: {
    i18nKey: 'domain_tab_general_information_status_unavailable',
    statusColor: BADGE_COLOR.neutral,
  },
  [TransferLockStatusEnum.UNLOCKED]: {
    i18nKey: 'domain_tab_general_information_status_disabled',
    statusColor: BADGE_COLOR.warning,
    icon: ICON_NAME.lockOpen,
  },
  [TransferLockStatusEnum.UNLOCKING]: {
    i18nKey: 'domain_tab_general_information_status_disabling',
    statusColor: BADGE_COLOR.information,
    icon: ICON_NAME.lockOpen,
  },
};

export const DOMAIN_DNSSEC_STATUS: Record<string, StatusDetails> = {
  [DnssecStatusEnum.DISABLED]: {
    i18nKey: 'domain_tab_general_information_status_disabled',
    statusColor: BADGE_COLOR.critical,
    icon: ICON_NAME.shieldOff,
  },
  [DnssecStatusEnum.ENABLED]: {
    i18nKey: 'domain_tab_general_information_status_enabled',
    statusColor: BADGE_COLOR.success,
    icon: ICON_NAME.shieldCheck,
  },
  [DnssecStatusEnum.NOT_SUPPORTED]: {
    i18nKey: 'domain_tab_general_information_status_unavailable',
    statusColor: BADGE_COLOR.neutral,
  },
  [DnssecStatusEnum.ENABLE_IN_PROGRESS]: {
    i18nKey: 'domain_tab_general_information_status_enabling',
    statusColor: BADGE_COLOR.information,
    icon: ICON_NAME.shieldCheck,
  },
  [DnssecStatusEnum.DISABLE_IN_PROGRESS]: {
    i18nKey: 'domain_tab_general_information_status_disabling',
    statusColor: BADGE_COLOR.warning,
    icon: ICON_NAME.shieldOff,
  },
};

export const DOMAIN_PENDING_ACTIONS: Record<string, StatusDetails> = {
  [LifecycleCapacitiesEnum.AutoRenewInProgress]: {
    i18nKey: 'domain_status_auto_renew_in_progress',
    statusColor: BADGE_COLOR.information,
  },
  [LifecycleCapacitiesEnum.DeleteAtExpiration]: {
    i18nKey: 'domain_status_terminate_asked',
    statusColor: BADGE_COLOR.warning,
  },
  [LifecycleCapacitiesEnum.EarlyRenewal]: {
    i18nKey: 'domain_status_auto_renew_in_progress',
    statusColor: BADGE_COLOR.information,
  },
  [LifecycleCapacitiesEnum.Terminate]: {
    i18nKey: 'domain_status_terminate',
    statusColor: BADGE_COLOR.critical,
  },
  [LifecycleCapacitiesEnum.TerminateAtEngagementDate]: {
    i18nKey: 'domain_status_terminate_asked',
    statusColor: BADGE_COLOR.critical,
  },
  [LifecycleCapacitiesEnum.TerminateAtExpirationDate]: {
    i18nKey: 'domain_status_terminate_asked',
    statusColor: BADGE_COLOR.critical,
  },
};

export const contactTypeTranslationKeys: Record<string, string> = {
  contactOwner: 'domain_tab_contact_management_holder_title',
  contactAdministrator: 'domain_tab_contact_management_admin_title',
  contactTechnical: 'domain_tab_contact_management_tech_title',
  contactBilling: 'domain_tab_contact_management_billing_title',
};
