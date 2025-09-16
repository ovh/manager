import { CountryCode } from '@ovh-ux/manager-config';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  DashboardTileItem,
  DashboardTileItemTemplate,
} from '../DashboardTile.types';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

export const DOC_BASE_URL = 'https://docs.ovh.com';

export const DOCUMENTATION_GUIDE_LINKS: {
  [guideName: string]: Partial<GuideLinks>;
} = {
  getting_started: {
    DEFAULT: '/public-cloud/premiers-pas-instance-public-cloud/',
    DE: '/de/public-cloud/premiers-pas-instance-public-cloud/',
    ES: '/es/public-cloud/premiers-pas-instance-public-cloud/',
    FR: '/fr/public-cloud/premiers-pas-instance-public-cloud/',
    GB: '/gb/public-cloud/premiers-pas-instance-public-cloud/',
    CA: '/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
    QC: '/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
    US: '/us/public-cloud/premiers-pas-instance-public-cloud/',
  },
  public_cloud: {
    DEFAULT: '/public-cloud/',
    DE: '/de/public-cloud/',
    ES: '/es/public-cloud/',
    FR: '/fr/public-cloud/',
    GB: '/gb/public-cloud/',
    CA: '/ca/fr/public-cloud/',
    QC: '/ca/fr/public-cloud/',
    US: '/us/public-cloud/',
  },
  instances: {
    DEFAULT: '/public-cloud/creer-instance-espace-client/',
    DE: '/de/public-cloud/creer-instance-espace-client/',
    ES: '/es/public-cloud/creer-instance-espace-client/',
    FR: '/fr/public-cloud/creer-instance-espace-client/',
    GB: '/gb/public-cloud/creer-instance-espace-client/',
    CA: '/ca/fr/public-cloud/creer-instance-espace-client/',
    QC: '/ca/fr/public-cloud/creer-instance-espace-client/',
    US: '/us/public-cloud/creer-instance-espace-client/',
  },
  billing: {
    DEFAULT: '/public-cloud/comprendre-facturation-cloud/',
    DE: '/de/public-cloud/comprendre-facturation-cloud/',
    ES: '/es/public-cloud/comprendre-facturation-cloud/',
    FR: '/fr/public-cloud/comprendre-facturation-cloud/',
    GB: '/gb/public-cloud/comprendre-facturation-cloud/',
    CA: '/ca/fr/public-cloud/comprendre-facturation-cloud/',
    QC: '/ca/fr/public-cloud/comprendre-facturation-cloud/',
    US: '/us/public-cloud/comprendre-facturation-cloud/',
  },
  guides: {
    DEFAULT: '/public-cloud/',
    DE: '/de/public-cloud/',
    ES: '/es/public-cloud/',
    FR: '/fr/public-cloud/',
    GB: '/gb/public-cloud/',
    CA: '/ca/fr/public-cloud/',
    QC: '/ca/fr/public-cloud/',
    US: '/us/public-cloud/',
  },
};

export const DOCUMENTATION_LINKS_TEMPLATE: DashboardTileItemTemplate[] = [
  {
    labelTranslationKey: 'pci_projects_project_getting_started',
    linkLabelTranslationKey: 'pci_projects_project_essential_to_start',
    documentationGuideKey: 'getting_started',
  },
  {
    labelTranslationKey: 'pci_projects_project_public_cloud',
    linkLabelTranslationKey: 'pci_projects_project_get_familiar',
    documentationGuideKey: 'public_cloud',
  },
  {
    labelTranslationKey: 'pci_projects_project_instances',
    linkLabelTranslationKey: 'pci_projects_project_manage_instances',
    documentationGuideKey: 'instances',
  },
  {
    labelTranslationKey: 'pci_projects_project_billing',
    linkLabelTranslationKey: 'pci_projects_project_understand_manage',
    documentationGuideKey: 'billing',
  },
  {
    labelTranslationKey: 'pci_projects_project_guides',
    linkLabelTranslationKey: 'pci_projects_project_see_all_guides',
    documentationGuideKey: 'guides',
  },
];

export const COMMUNITY_LINKS: DashboardTileItem[] = [
  {
    labelTranslationKey: 'pci_projects_project_roadmap',
    linkLabelTranslationKey: 'pci_projects_project_discover_participate',
    link: 'https://github.com/ovh/public-cloud-roadmap',
  },
  {
    labelTranslationKey: 'pci_projects_project_developer_center',
    linkLabelTranslationKey: 'pci_projects_project_start_with_products',
    link: 'https://developer.ovh.com/',
  },
  {
    labelTranslationKey: 'pci_projects_project_community',
  },
  {
    labelTranslationKey: '',
    linkLabelTranslationKey: 'pci_projects_project_discuss_discord',
    link: 'https://discord.gg/ovhcloud',
  },
  {
    labelTranslationKey: '',
    linkLabelTranslationKey: 'pci_projects_project_discuss_community',
    link: 'https://community.ovh.com/',
  },
];

export const CREDIT_VOUCHER_LINK: DashboardTileItem = {
  linkLabelTranslationKey: 'pci_projects_project_credits_vouchers',
  link: '/public-cloud/pci/projects/{projectId}/billing/credits',
  color: 'primary',
  iconODS: ODS_ICON_NAME.arrowRight,
  ariaLabelTranslationKey: 'pci_projects_project_link_credits_vouchers_aria',
  hideTileIfNoOtherItems: true,
};
