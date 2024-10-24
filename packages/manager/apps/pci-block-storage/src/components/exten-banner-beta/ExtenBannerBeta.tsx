import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { FA_EXTEN_BANNER } from '@/api/data/quota';

export function ExtenBannerBeta() {
  const { t } = useTranslation('exten-banner-beta');
  const { data } = useFeatureAvailability([FA_EXTEN_BANNER]);

  if (!data?.[FA_EXTEN_BANNER]) return null;

  return (
    <OsdsMessage type={ODS_MESSAGE_TYPE.info}>
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {t('exten_banner_description')}
      </OsdsText>
    </OsdsMessage>
  );
}
