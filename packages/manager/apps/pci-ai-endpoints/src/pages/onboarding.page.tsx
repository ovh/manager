import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  OnboardingLayout,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { OsdsText, OsdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { useGetTokens } from '@/hooks/api/database/token/useToken.hook';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const tokensQuery = useGetTokens({ projectId });

  const guideList = [
    {
      id: 1,
      texts: {
        title: t('ai_endpoints_guide1Title'),
        description: t('ai_endpoints_guide1Description'),
        category: t('ai_endpoints_guideCategory'),
      },
      href: link?.guideLink1,
    },
    {
      id: 2,
      texts: {
        title: t('ai_endpoints_guide2Title'),
        description: t('ai_endpoints_guide2Description'),
        category: t('ai_endpoints_guideCategory'),
      },
      href: link?.guideLink2,
    },
    {
      id: 3,
      texts: {
        title: t('ai_endpoints_guide3Title'),
        description: t('ai_endpoints_guide3Description'),
        category: t('ai_endpoints_tutoCategory'),
      },
      href: link?.tutoLink1,
    },
  ];

  const title = t('ai_endpoints_title');
  const imgSrc = { src: onboardingImgSrc };
  const descBis = t('ai_endpoints_descriptionBis');

  return (
    <div className="flex justify-center">
      <RedirectionGuard
        isLoading={tokensQuery.isLoading}
        route={`/pci/projects/${projectId}/ai/endpoints/metrics`}
        condition={
          Array.isArray(tokensQuery.data) && tokensQuery.data.length > 0
        }
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
                {t('ai_endpoints_description')}
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
              <OsdsButton
                size={ODS_BUTTON_SIZE.md}
                variant={ODS_BUTTON_VARIANT.flat}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="flex w-[18rem] mt-12 mx-auto"
                onClick={() =>
                  navigate(`/pci/projects/${projectId}/ai/endpoints/token`)
                }
              >
                {t('ai_endpoints_create_API_key')}
              </OsdsButton>
            </>
          }
        >
          <div className="mb-4 sm:hidden"></div>
          {guideList.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </OnboardingLayout>
      </RedirectionGuard>
    </div>
  );
}
