/**
 * The onboarding of Managed Backup for VMware, as the MBV app (Manager v8)
 * renders it on its own onboarding page (BKP-1775): same launch offer window,
 * same guides. Change them there first.
 */

/** Days, Europe/Paris, both included. */
export const LAUNCH_OFFER_WINDOW = {
  from: '2026-10-29',
  to: '2027-02-28',
};

export const ONBOARDING_GUIDES = [
  {
    id: 'getting_started',
    url: {
      fr:
        'https://docs.ovhcloud.com/fr/guides/storage-and-backup/managed-backup-for-vmware/getting-started',
      en:
        'https://docs.ovhcloud.com/en/guides/storage-and-backup/managed-backup-for-vmware/getting-started',
    },
  },
  {
    id: 'tag_vm',
    url: {
      fr:
        'https://docs.ovhcloud.com/fr/guides/storage-and-backup/managed-backup-for-vmware/tag-vm',
      en:
        'https://docs.ovhcloud.com/en/guides/storage-and-backup/managed-backup-for-vmware/tag-vm',
    },
  },
  {
    id: 'migrate',
    url: {
      fr:
        'https://docs.ovhcloud.com/fr/guides/storage-and-backup/managed-backup-for-vmware/migrate',
      en:
        'https://docs.ovhcloud.com/en/guides/storage-and-backup/managed-backup-for-vmware/migrate',
    },
  },
];

export const TRANSLATION_PREFIX =
  'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_onboarding';

export default {
  LAUNCH_OFFER_WINDOW,
  ONBOARDING_GUIDES,
  TRANSLATION_PREFIX,
};
