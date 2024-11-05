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
import { useProjectsAvailableVolumes } from '@/api/hooks/useProjectsAvailableVolumes';

const extenProducts = [
  'volume.high-speed-BETA.consumption',
  'volume.classic-BETA.consumption',
];

function Banner() {
  const { t } = useTranslation('exten-banner-beta');
  const { projectId } = useParams();
  const { data: availableVolumes } = useProjectsAvailableVolumes(projectId);

  const regionsString = useMemo(
    () =>
      availableVolumes
        ? [
            ...new Set(
              availableVolumes.plans
                .filter((p) => extenProducts.includes(p.code))
                .flatMap((p) => p.regions)
                .map((r) => r.name),
            ),
          ].join(', ')
        : '',
    [availableVolumes],
  );

  if (!availableVolumes) return null;

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
