import { GUIDES } from '@/configuration/guide';

export type GuideId =
  | 'localisation'
  | 'objectsNumber'
  | 'usedSpace'
  | 'endpoint'
  | 'cnameTxtValue'
  | 'virtualHostedStyle'
  | 'objectLock'
  | 'versioning'
  | 'tags'
  | 'accessLogs'
  | 'staticWebsite'
  | 'asyncReplication'
  | 'lifecycle'
  | 'defaultEncryption'
  | 'allGuides'
  | 'gettingStarted';

export type SectionId = 'localZone' | 's3Standard' | 'swift' | 'all';

export type Guide = {
  id: GuideId;
  titleKey: string;
  descriptionKey?: string;
  linksByLocale: Record<string, string>;
};

/**
 * All available guides with their localized links
 * Links are organized by locale from the centralized GUIDES configuration
 * Translation namespace: pci-object-storage/guides
 */
export const getAllGuides = (): Record<GuideId, Omit<Guide, 'id'>> => ({
  allGuides: {
    titleKey: 'guideAll',
    linksByLocale: GUIDES.ALL_GUIDES,
  },
  gettingStarted: {
    titleKey: 'guideGettingStarted',
    linksByLocale: GUIDES.GETTING_STARTED,
  },
  localisation: {
    titleKey: 'guideLocalisation',
    descriptionKey: 'guideLocalisationDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION,
  },
  objectsNumber: {
    titleKey: 'guideObjectsNumber',
    descriptionKey: 'guideObjectsNumberDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION, // FAQ uses same links as localisation
  },
  usedSpace: {
    titleKey: 'guideUsedSpace',
    descriptionKey: 'guideUsedSpaceDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION, // FAQ uses same links as localisation
  },
  endpoint: {
    titleKey: 'guideEndpoint',
    descriptionKey: 'guideEndpointDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION,
  },
  cnameTxtValue: {
    titleKey: 'guideCnameTxtValue',
    descriptionKey: 'guideCnameTxtValueDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION,
  },
  virtualHostedStyle: {
    titleKey: 'guideVirtualHostedStyle',
    descriptionKey: 'guideVirtualHostedStyleDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION,
  },
  objectLock: {
    titleKey: 'guideObjectLock',
    descriptionKey: 'guideObjectLockDescription',
    linksByLocale: GUIDES.STORAGE_OBJECT_LOCK,
  },
  versioning: {
    titleKey: 'guideVersioning',
    descriptionKey: 'guideVersioningDescription',
    linksByLocale: GUIDES.STORAGE_VERSIONING,
  },
  tags: {
    titleKey: 'guideTags',
    descriptionKey: 'guideTagsDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION, // Uses same links as localisation
  },
  accessLogs: {
    titleKey: 'guideAccessLogs',
    descriptionKey: 'guideAccessLogsDescription',
    linksByLocale: GUIDES.STORAGE_ACCESS_LOGS,
  },
  staticWebsite: {
    titleKey: 'guideStaticWebsite',
    descriptionKey: 'guideStaticWebsiteDescription',
    linksByLocale: GUIDES.STORAGE_STATIC_WEBSITE,
  },
  asyncReplication: {
    titleKey: 'guideAsyncReplication',
    descriptionKey: 'guideAsyncReplicationDescription',
    linksByLocale: GUIDES.STORAGE_ASYNC_REPLICATION,
  },
  lifecycle: {
    titleKey: 'guideLifecycle',
    descriptionKey: 'guideLifecycleDescription',
    linksByLocale: GUIDES.STORAGE_LIFECYCLE,
  },
  defaultEncryption: {
    titleKey: 'guideDefaultEncryption',
    descriptionKey: 'guideDefaultEncryptionDescription',
    linksByLocale: GUIDES.STORAGE_LOCALISATION, // Uses same links as localisation
  },
});

/**
 * Section definitions matching HelpDrawer's getFilteredHelperItems logic
 */
export const GUIDE_SECTIONS: Record<SectionId, GuideId[]> = {
  swift: [
    'localisation',
    'objectsNumber',
    'usedSpace',
    'endpoint',
    'cnameTxtValue',
  ],
  localZone: [
    'localisation',
    'endpoint',
    'virtualHostedStyle',
    'objectLock',
    'versioning',
    'lifecycle',
  ],
  s3Standard: [
    'localisation',
    'objectsNumber',
    'usedSpace',
    'endpoint',
    'virtualHostedStyle',
    'objectLock',
    'versioning',
    'tags',
    'accessLogs',
    'staticWebsite',
    'asyncReplication',
    'lifecycle',
    'defaultEncryption',
  ],
  all: [
    'localisation',
    'objectsNumber',
    'usedSpace',
    'endpoint',
    'cnameTxtValue',
    'virtualHostedStyle',
    'objectLock',
    'versioning',
    'tags',
    'accessLogs',
    'staticWebsite',
    'asyncReplication',
    'lifecycle',
    'defaultEncryption',
  ],
};

export const resolveGuides = (selectors: (SectionId | GuideId)[]): Guide[] => {
  const allGuides = getAllGuides();
  const guideIdsSet = new Set<GuideId>();

  // Resolve each selector (could be a section or individual guide ID)
  selectors.forEach((selector) => {
    if (selector in GUIDE_SECTIONS) {
      // It's a section - add all guides from that section
      const sectionGuides = GUIDE_SECTIONS[selector as SectionId];
      sectionGuides.forEach((id) => guideIdsSet.add(id));
    } else if (selector in allGuides) {
      // It's an individual guide ID
      guideIdsSet.add(selector as GuideId);
    }
  });

  return Array.from(guideIdsSet).map((id) => ({
    id,
    ...allGuides[id],
  }));
};
