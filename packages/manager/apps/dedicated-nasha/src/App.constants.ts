export const appName = 'dedicated-nasha';

export const NASHA_USE_SIZE_NAME = 'size';
export const SERVICE_TYPE = 'DEDICATED_NASHA';
export const GUIDES_URL = {
  DEFAULT: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046698',
};

// Changelog configuration (same chapters as legacy Dedicated app)
export const CHANGELOG_CHAPTERS = ['Storage_backup', 'storage_backup', 'nasha'] as const;

export const CHANGELOG_LINKS = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Storage',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Storage',
  'feature-request':
    'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
} as const;
