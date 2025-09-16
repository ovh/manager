export const OVHCLOUD_TAG_TYPES = {
  CUSTOM: 'custom',
  OVHCLOUD: 'ovhcloud',
};

export const OVHCLOUD_TAGS = [
  {
    key: 'Environment',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: [
      'Production',
      'Staging',
      'Development',
      'QA',
      'UAT',
      'Pre-production',
    ],
  },
  {
    key: 'Department',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['Finance', 'Marketing', 'IT'],
  },
  {
    key: 'Project',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['Marketing-campaign', 'Proof-of-Concept'],
  },
  {
    key: 'Team',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: [
      'Engineering-team',
      'Support-team',
      'Data-Science',
      'Sales',
      'Ops',
      'Marketing',
    ],
  },
  {
    key: 'Confidential',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: [
      'Confidential-Personally-identifiable-information',
      'Financial-data',
      'Internal',
      'External',
    ],
  },
  {
    key: 'Compliance',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['HIPAA', 'CCPA', 'PCI-DSS', 'GPDR'],
  },
  {
    key: 'Content-Management-System',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['Wordpress', 'Drupal'],
  },
  {
    key: 'eCommerce',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['WooCommerce', 'Magento', 'Prestashop'],
  },
  {
    key: 'Business-Intelligence',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['Tableau', 'PowerBI', 'Superset'],
  },
  {
    key: 'DevOps',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['JenKins', 'GitLab', 'Github'],
  },
  {
    key: 'Mobile',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: ['Xamarin', 'React-native'],
  },
  {
    key: 'Cost-center',
    type: OVHCLOUD_TAG_TYPES.OVHCLOUD,
    values: [
      'Marketing',
      'Sales',
      'Operations',
      'Finance',
      'Research-and-Development',
      'Human-Resources',
    ],
  },
];

export default {
  OVHCLOUD_TAGS,
  OVHCLOUD_TAG_TYPES,
};
