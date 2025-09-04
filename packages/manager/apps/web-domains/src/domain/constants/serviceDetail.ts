import { ChangelogLinks } from '@ovh-ux/manager-react-components';
import { ParamValueType } from '@ovh-ux/url-builder';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DashboardTabItemProps } from '@/domain/types/serviceDetail';
import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '../enum/domainState.enum';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import { BannerResult, ComboRule } from '../types/domainResource';

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
    id: 'dnssec',
    name: 'domain_tab_name_ds_records',
    value: 'dnssec',
  },
  {
    id: 'contact-management',
    name: 'domain_tab_name_contact_management',
    value: 'contact-management',
  },
];

export const changelogLinks: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/18/views/2?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  roadmap:
    'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  'feature-request':
    'https://github.com/ovh/hosting-domain-names-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

const ongoingOperationLink: [string, string, Record<string, ParamValueType>] = [
  'web-ongoing-operations',
  '/domain',
  {},
];

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
        linki18n: 'domain_tab_general_information_banner_link_ongoing_op',
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
