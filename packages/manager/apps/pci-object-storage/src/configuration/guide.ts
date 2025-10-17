export const GUIDES = {
  OBJ_STO_ONBOARDING_TUTO_1: {
    fr_FR:
      'https://docs.ovh.com/gb/en/public-cloud/place-an-object-storage-container-behind-domain-name/',
    fr_CA:
      'https://docs.ovh.com/gb/en/public-cloud/place-an-object-storage-container-behind-domain-name/',
    default:
      'https://docs.ovh.com/gb/en/public-cloud/place-an-object-storage-container-behind-domain-name/',
  },
  OBJ_STO_ONBOARDING_TUTO_2: {
    fr_FR:
      'https://docs.ovh.com/gb/en/public-cloud/configure-auto-delete-objects/',
    fr_CA:
      'https://docs.ovh.com/gb/en/public-cloud/configure-auto-delete-objects/',
    default:
      'https://docs.ovh.com/gb/en/public-cloud/configure-auto-delete-objects/',
  },
  OBJ_STO_ONBOARDING_TUTO_3: {
    fr_FR:
      'https://docs.ovh.com/gb/en/public-cloud/share_an_object_via_a_temporary_url/',
    fr_CA:
      'https://docs.ovh.com/gb/en/public-cloud/share_an_object_via_a_temporary_url/',
    default:
      'https://docs.ovh.com/gb/en/public-cloud/share_an_object_via_a_temporary_url/',
  },
  OBJ_STO_RCLONE: {
    fr_FR: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
    fr_CA: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
    default: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
  },
  OBJ_STO_ENCRYPTION: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
    default:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047314',
  },
  OBJ_STO_CLASSES: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
    default:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  },
  OBJ_STO_PRICES: {
    fr_FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
    fr_CA: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
    default: 'https://www.ovhcloud.com/en/public-cloud/prices/#439',
  },
};

export function getGuideUrl(
  guide: typeof GUIDES[keyof typeof GUIDES],
  locale: string,
): string {
  return guide[locale as keyof typeof guide] || guide.default;
}
