import { CountryCode } from '@ovh-ux/manager-config';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

const DOC_BASE_URL = 'https://docs.ovh.com';

const DOCUMENTATION_GUIDE_LINKS: {
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

export const getDocumentationLinks = (subsidiary: CountryCode | string) => {
  return [
    {
      labelKey: 'getting_started',
      descriptionKey: 'essential_to_start',
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS.getting_started[subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS.getting_started.DEFAULT),
    },
    {
      labelKey: 'public_cloud',
      descriptionKey: 'get_familiar',
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS.public_cloud[subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS.public_cloud.DEFAULT),
    },
    {
      labelKey: 'instances',
      descriptionKey: 'manage_instances',
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS.instances[subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS.instances.DEFAULT),
    },
    {
      labelKey: 'billing',
      descriptionKey: 'understand_manage',
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS.billing[subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS.billing.DEFAULT),
    },
    {
      labelKey: 'guides',
      descriptionKey: 'see_all_guides',
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS.guides[subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS.guides.DEFAULT),
    },
  ];
};

export const COMMUNITY_LINKS = [
  {
    labelKey: 'roadmap',
    descriptionKey: 'discover_participate',
    link: 'https://github.com/ovh/public-cloud-roadmap',
  },
  {
    labelKey: 'developer_center',
    descriptionKey: 'start_with_products',
    link: 'https://developer.ovh.com/',
  },
  {
    labelKey: 'community',
    items: [
      {
        descriptionKey: 'discuss_discord',
        link: 'https://discord.gg/ovhcloud',
      },
      {
        descriptionKey: 'discuss_community',
        link: 'https://community.ovh.com/',
      },
    ],
  },
];

// Add billing section links including voucher link
export const BILLING_LINKS = [
  {
    labelKey: 'credits_vouchers',
    descriptionKey: 'credits_vouchers',
    link: '/public-cloud/pci/projects/{projectId}/billing/credits',
    target: '_blank',
    rel: 'noopener noreferrer',
    color: 'primary',
    icon: 'arrow-right',
    ariaLabelKey: 'link_credits_vouchers_aria',
  },
];
