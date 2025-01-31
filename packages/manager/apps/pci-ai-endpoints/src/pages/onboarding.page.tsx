import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Card,
  OnboardingLayout,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { MetricData } from '@/types/cloud/project/database/metric';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const { projectId } = useParams();
  const [metricsData, setMetricsData] = useState<{ data: MetricData[] }>({
    data: [],
  });

  const metricsQuery = useGetMetrics(
    projectId,
    encodeURIComponent(new Date(2024, 0, 1).toISOString()),
    encodeURIComponent(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      ).toISOString(),
    ),
  );

  useEffect(() => {
    if (Array.isArray(metricsQuery?.data)) {
      setMetricsData({ data: metricsQuery.data });
    }
  }, [metricsQuery?.data]);

  const guideList = [
    {
      id: 1,
      texts: {
        title: t('guide1Title'),
        description: t('guide1Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink1,
    },
    {
      id: 2,
      texts: {
        title: t('guide2Title'),
        description: t('guide2Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink2,
    },
    {
      id: 3,
      texts: {
        title: t('guide3Title'),
        description: t('guide3Description'),
        category: t('tutoCategory'),
      },
      href: link?.tutoLink1,
    },
  ];

  const title: string = t('title');
  const imgSrc = {
    src: onboardingImgSrc,
  };
  const descBis: string = t('descriptionBis');

  return (
    <RedirectionGuard
      isLoading={false}
      route={`/pci/projects/${projectId}/ai/endpoints/metrics`}
      condition={metricsData.data.length > 0}
    >
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="block mt-8"
            >
              {t('description')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="block mt-4 max-sm:mb-4"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: descBis,
                }}
              />
            </OsdsText>
          </>
        }
        moreInfoButtonLabel={t('goToAiEndpoint')}
        moreInfoHref="https://endpoints.ai.cloud.ovh.net/"
      >
        <div className="mb-4 sm:hidden"></div>
        {guideList.map((tile) => (
          <Card key={tile.id} href={tile.href} texts={tile.texts} />
        ))}
      </OnboardingLayout>
    </RedirectionGuard>
  );
}
