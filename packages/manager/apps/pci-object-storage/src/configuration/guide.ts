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
};

export function getGuideUrl(
  guide: typeof GUIDES[keyof typeof GUIDES],
  locale: string,
): string {
  return guide[locale as keyof typeof guide] || guide.default;
}
