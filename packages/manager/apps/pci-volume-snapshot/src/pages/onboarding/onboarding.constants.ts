import { Subsidiary } from '@ovh-ux/manager-config';

export type TGuide = {
  id: string;
  links: Partial<Record<Subsidiary, string>> & Record<'DEFAULT', string>;
};

export const ONBOARDING_GUIDES: TGuide[] = [
  {
    id: 'transfer-volume-backup',
    links: {
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/33015248904595-Downloading-and-Transferring-an-Instance-Backup-from-One-OpenStack-Region-to-Another',
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/transfer_volume_backup_from_one_datacentre_to_another/',
    },
  },
];
