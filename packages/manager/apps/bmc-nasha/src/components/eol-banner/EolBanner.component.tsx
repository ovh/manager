import { useTranslation } from 'react-i18next';

import { useMe } from '@ovh-ux/manager-react-components';
import { Message } from '@ovh-ux/muk';

const EOL_LV1_LV2_SERVICES_LINK_INFO: Record<string, string> = {
  DEFAULT: 'https://docs.ovh.com/gb/en/storage/file-storage/nas/migration/',
  ASIA: 'https://docs.ovh.com/asia/en/storage/file-storage/nas/migration/',
  AU: 'https://docs.ovh.com/au/en/storage/file-storage/nas/migration/',
  CA: 'https://docs.ovh.com/ca/en/storage/file-storage/nas/migration/',
  DE: 'https://docs.ovh.com/de/storage/file-storage/nas/migration/',
  ES: 'https://docs.ovh.com/es/storage/file-storage/nas/migration/',
  FR: 'https://docs.ovh.com/fr/storage/file-storage/nas/migration/',
  GB: 'https://docs.ovh.com/gb/en/storage/file-storage/nas/migration/',
  IE: 'https://docs.ovh.com/ie/en/storage/file-storage/nas/migration/',
  IT: 'https://docs.ovh.com/it/storage/file-storage/nas/migration/',
  PL: 'https://docs.ovh.com/it/storage/file-storage/nas/migration/',
  PT: 'https://docs.ovh.com/pt/storage/file-storage/nas/migration/',
  QC: 'https://docs.ovh.com/ca/fr/storage/file-storage/nas/migration/',
  US: 'https://docs.ovh.com/us/en/storage/file-storage/nas/migration/',
  WS: 'https://docs.ovh.com/es/storage/file-storage/nas/migration/',
};

type EolBannerProps = {
  serviceName: string;
};

export function EolBanner({ serviceName }: EolBannerProps) {
  const { t } = useTranslation('dashboard');
  const { me } = useMe();

  const subsidiary = me?.ovhSubsidiary || 'DEFAULT';
  const eolLv1Lv2ServicesInfoLink =
    EOL_LV1_LV2_SERVICES_LINK_INFO[subsidiary] ||
    EOL_LV1_LV2_SERVICES_LINK_INFO.DEFAULT;

  return (
    <Message
      type="warning"
      dismissable
      className="mb-4"
    >
      <p>
        {t('eol_banner.description_part_1', { serviceName })}
      </p>
      <p>
        {t('eol_banner.description_part_2')}
      </p>
      <p className="m-0">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={eolLv1Lv2ServicesInfoLink}
        >
          {t('eol_banner.info_link')}
        </a>
      </p>
    </Message>
  );
}

