import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { DashboardItem } from '../data/models/Dashboard.type';
import { DOC_BASE_URL, FEATURE_AVAILABILITY } from './base';
import { PCI_FEATURES_STATES } from './features';

export const COMMUNITY_LINKS = [
  {
    term: 'pci_projects_home_community_roadmap_term',
    description: 'pci_projects_home_community_roadmap_description',
    href: 'https://github.com/ovh/public-cloud-roadmap/projects',
    trackingName: 'go-to-community-roadmap',
  },
  {
    term: 'pci_projects_home_community_discord_term',
    description: 'pci_projects_home_community_discord_description',
    href: 'https://discord.gg/ovhcloud',
    trackingName: 'go-to-community-discord',
  },
];

export const DASHBOARD_DOCUMENTATION_LINKS = [
  {
    term: 'pci_projects_home_documentation_getting_started_term',
    description: 'pci_projects_home_documentation_getting_started_description',
    href: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-essential-information/',
    feature: FEATURE_AVAILABILITY.CLOUD_ESSENTIAL_INFORMATION,
    trackingName: 'go-to-pci-basics',
  },
  {
    term: 'pci_projects_home_documentation_interface_term',
    description: 'pci_projects_home_documentation_interface_description',
    href: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-interface/',
    feature: FEATURE_AVAILABILITY.PUBLIC_CLOUD_INTERFACE,
    trackingName: 'go-to-pci-interface',
  },
  {
    term: 'pci_projects_home_documentation_instances_term',
    description: 'pci_projects_home_documentation_instances_description',
    href: 'https://docs.ovh.com/gb/en/public-cloud/get-started-with-a-public-cloud-instance/',
    feature: FEATURE_AVAILABILITY.START_PCI_INSTANCE,
    trackingName: 'go-to-get-started-with-instances',
  },
  {
    term: 'pci_projects_home_documentation_billing_term',
    description: 'pci_projects_home_documentation_billing_description',
    href: 'https://docs.ovh.com/gb/en/public-cloud/information-on-cloud-billing-options/',
    feature: FEATURE_AVAILABILITY.CLOUD_BILLING_OPTIONS,
    trackingName: 'go-to-billing',
  },
  {
    term: 'pci_projects_home_documentation_guides_term',
    description: 'pci_projects_home_documentation_guides_description',
    href: 'https://docs.ovh.com/gb/en/',
    feature: FEATURE_AVAILABILITY.ALL_GUIDES,
    trackingName: 'go-to-all-guides',
  },
  {
    term: 'pci_projects_home_documentation_block_storage_term',
    description: 'pci_projects_home_documentation_block_storage_description',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/20566582694291-Creating-and-configuring-an-additional-disk-on-an-instance',
    feature: FEATURE_AVAILABILITY.START_WITH_BLOCK_STORAGE,
    trackingName: 'go-to-start_with_block_storage',
  },
];

// Quick Access Items - Base configuration without iconImage (will be added in component)
export const DASHBOARD_QUICK_ACCESS_ITEMS_BASE: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_home_instances',
    descriptionTranslationKey: 'pci_projects_home_create_instance',
    link: PCI_FEATURES_STATES.INSTANCES!.ADD!.url,
    featureFlag: FEATURE_AVAILABILITY.INSTANCE,
    trackingName: 'create_instance',
  },
  {
    labelTranslationKey: 'pci_projects_home_kubernetes',
    descriptionTranslationKey: 'pci_projects_home_create_cluster',
    link: PCI_FEATURES_STATES.KUBERNETES!.LIST!.url,
    featureFlag: FEATURE_AVAILABILITY.KUBERNETES,
    trackingName: 'create_kubernetes',
  },
  {
    labelTranslationKey: 'pci_projects_home_object_storage',
    descriptionTranslationKey: 'pci_projects_home_create_container',
    link: PCI_FEATURES_STATES.OBJECTS!.ADD!.url,
    featureFlag: FEATURE_AVAILABILITY.OBJECT_STORAGE,
    trackingName: 'add_objects_storage_container',
  },
  {
    labelTranslationKey: 'pci_projects_home_block_storage',
    descriptionTranslationKey: 'pci_projects_home_create_volume',
    link: PCI_FEATURES_STATES.BLOCKS!.LIST!.url,
    featureFlag: FEATURE_AVAILABILITY.BLOCK_STORAGE,
    trackingName: 'create_volume_block_storage',
  },
  {
    labelTranslationKey: 'pci_projects_home_network',
    descriptionTranslationKey: 'pci_projects_home_manage_vrack',
    link: PCI_FEATURES_STATES.PRIVATE_NETWORK!.LIST!.url,
    featureFlag: FEATURE_AVAILABILITY.PRIVATE_NETWORK,
    trackingName: 'manage_privateNetwork',
  },
  {
    labelTranslationKey: 'pci_projects_home_database',
    descriptionTranslationKey: 'pci_projects_home_create_database',
    link: PCI_FEATURES_STATES.DATABASES!.ADD!.url,
    featureFlag: FEATURE_AVAILABILITY.DATABASES_ANALYTICS,
    trackingName: 'create_service_database',
  },
];

export const DASHBOARD_OTHER_ACTIONS_ITEMS: DashboardItem[] = [
  {
    iconODS: ODS_ICON_NAME.book,
    labelTranslationKey: 'pci_projects_home_create_ai_notebook',
    link: PCI_FEATURES_STATES.NOTEBOOKS!.LIST!.url,
    featureFlag: FEATURE_AVAILABILITY.NOTEBOOKS,
    trackingName: 'create_ai-notebook',
  },
  {
    iconODS: ODS_ICON_NAME.network,
    labelTranslationKey: 'pci_projects_home_create_load_balancer',
    link: PCI_FEATURES_STATES.LOADBALANCER!.LIST!.url,
    featureFlag: FEATURE_AVAILABILITY.LOAD_BALANCER,
    trackingName: 'create_load_balancer',
  },
  {
    iconODS: ODS_ICON_NAME.bill,
    labelTranslationKey: 'pci_projects_home_billing',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT!.BILLING_CONTROL!.url,
    featureFlag: FEATURE_AVAILABILITY.BILLING,
    trackingName: 'detail_billing',
  },
  {
    iconODS: ODS_ICON_NAME.cog,
    labelTranslationKey: 'pci_projects_home_quotas',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT!.QUOTA_AND_REGIONS!.url,
    featureFlag: FEATURE_AVAILABILITY.QUOTA,
    trackingName: 'detail_quotas',
  },
];

export const CREATING_GUIDE_URLS: Record<string, string> = {
  DEFAULT: `${DOC_BASE_URL}/en-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050390`,
  ASIA: `${DOC_BASE_URL}/asia-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050384`,
  AU: `${DOC_BASE_URL}/en-au-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0038069`,
  CA: `${DOC_BASE_URL}/en-ca-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050398`,
  DE: `${DOC_BASE_URL}/de-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050383`,
  ES: `${DOC_BASE_URL}/es-es-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050389`,
  EU: `${DOC_BASE_URL}/en-ie-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050387`,
  FR: `${DOC_BASE_URL}/fr-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050407`,
  GB: `${DOC_BASE_URL}/en-gb-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050388`,
  IE: `${DOC_BASE_URL}/en-ie-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050387`,
  IN: `${DOC_BASE_URL}/asia-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050384`,
  IT: `${DOC_BASE_URL}/it-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050404`,
  MA: `${DOC_BASE_URL}/fr-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050407`,
  NL: `${DOC_BASE_URL}/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938`,
  PL: `${DOC_BASE_URL}/pl-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050394`,
  PT: `${DOC_BASE_URL}/pt-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050395`,
  QC: `${DOC_BASE_URL}/fr-ca-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050397`,
  SG: `${DOC_BASE_URL}/en-sg-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050393`,
  SN: `${DOC_BASE_URL}/fr-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050407`,
  TN: `${DOC_BASE_URL}/fr-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050407`,
  US: `https://support.us.ovhcloud.com/hc/en-us/articles/20644404016787-All-You-Need-to-Know-to-Get-Started-with-Public-Cloud`,
  WE: `${DOC_BASE_URL}/en-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050390`,
  WS: `${DOC_BASE_URL}/es-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050392`,
};

const HELP_OVH_CLOUD_URL = 'https://help.ovhcloud.com';
const PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION =
  'public-cloud-compute-essential-information?id=kb_article_view&sysparm_article';

export const UPDATING_GUIDE_URLS: Record<string, string> = {
  DEFAULT: `${HELP_OVH_CLOUD_URL}/csm/en-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050390`,
  ASIA: `${HELP_OVH_CLOUD_URL}/csm/asia-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050384`,
  AU: `${HELP_OVH_CLOUD_URL}/csm/en-au-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0038069`,
  CA: `${HELP_OVH_CLOUD_URL}/csm/en-ca-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050398`,
  DE: `${HELP_OVH_CLOUD_URL}/csm/de-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050383`,
  ES: `${HELP_OVH_CLOUD_URL}/csm/es-es-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050389`,
  EU: `${HELP_OVH_CLOUD_URL}/csm/en-ie-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050387`,
  FR: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  GB: `${HELP_OVH_CLOUD_URL}/csm/en-gb-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050388`,
  IE: `${HELP_OVH_CLOUD_URL}/csm/en-ie-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050387`,
  IN: `${HELP_OVH_CLOUD_URL}/csm/asia-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050384`,
  IT: `${HELP_OVH_CLOUD_URL}/csm/it-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050404`,
  MA: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  NL: `${HELP_OVH_CLOUD_URL}/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938`,
  PL: `${HELP_OVH_CLOUD_URL}/csm/pl-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050394`,
  PT: `${HELP_OVH_CLOUD_URL}/csm/pt-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050395`,
  QC: `${HELP_OVH_CLOUD_URL}/csm/fr-ca-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050397`,
  SG: `${HELP_OVH_CLOUD_URL}/csm/en-sg-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050393`,
  SN: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  TN: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  US: `https://support.us.ovhcloud.com/hc/en-us/articles/20644404016787-All-You-Need-to-Know-to-Get-Started-with-Public-Cloud`,
  WE: `${HELP_OVH_CLOUD_URL}/csm/en-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050390`,
  WS: `${HELP_OVH_CLOUD_URL}/csm/es-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050392`,
};
