import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { FA_EXTEN_BANNER } from '@/api/data/quota';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';

const extenProducts = ['high-speed-BETA', 'classic-BETA'];

function Banner() {
  const { t } = useTranslation('exten-banner-beta');
  const { projectId } = useParams();
  const { data: volumeCatalog } = useVolumeCatalog(projectId);

  const regionsString = useMemo(
    () =>
      volumeCatalog
        ? [
            ...new Set(
              volumeCatalog.models
                .filter((p) => extenProducts.includes(p.name))
                .flatMap((p) => p.pricings)
                .flatMap((p) => p.regions),
            ),
          ].join(', ')
        : '',
    [volumeCatalog],
  );

  if (!volumeCatalog) return null;

  return (
    <OsdsMessage type={ODS_MESSAGE_TYPE.info}>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.info}
        style={{ whiteSpace: 'pre-wrap' }}
        hue={ODS_TEXT_COLOR_HUE._700}
      >
        {t('exten_banner_description', {
          regions: regionsString,
        })}
      </OsdsText>
    </OsdsMessage>
  );
}

export function ExtenBannerBeta() {
  const { data } = useFeatureAvailability([FA_EXTEN_BANNER]);

  if (!data?.[FA_EXTEN_BANNER]) return null;

  return <Banner />;
}
