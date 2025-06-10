export const OVHCLOUD_TAGS = [
  {
    key: 'Environment',
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
    values: ['Finance', 'Marketing', 'IT'],
  },
  {
    key: 'Project',
    values: ['Marketing-campaign', 'Proof-of-Concept'],
  },
  {
    key: 'Team',
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
    values: [
      'Confidential-Personally-identifiable-information',
      'Financial-data',
      'Internal',
      'External',
    ],
  },
  {
    key: 'Compliance',
    values: ['HIPAA', 'CCPA', 'PCI-DSS', 'GPDR'],
  },
  {
    key: 'Content-Management-System',
    values: ['Wordpress', 'Drupal'],
  },
  {
    key: 'eCommerce',
    values: ['WooCommerce', 'Magento', 'Prestashop'],
  },
  {
    key: 'Business-Intelligence',
    values: ['Tableau', 'PowerBI', 'Superset'],
  },
  {
    key: 'DevOps',
    values: ['JenKins', 'GitLab', 'Github'],
  },
  {
    key: 'Mobile',
    values: ['Xamarin', 'React-native'],
  },
  {
    key: 'Cost-center',
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

export const OVHCLOUD_TAG_TYPES = {
  CUSTOM: 'custom',
  OVHCLOUD: 'ovhcloud',
};

export default {
  OVHCLOUD_TAGS,
  OVHCLOUD_TAG_TYPES,
};
