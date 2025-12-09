import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { GuideMenu } from '@ovh-ux/muk';

import { useGuideLinks } from '@/hooks/useGuideLinks';
import { useSurveyLink } from '@/hooks/useSurveyLink';

export const GuideMenuWithSurvey = () => {
  const { t } = useTranslation('dashboard');
  const guideItems = useGuideLinks();
  const surveyUrl = useSurveyLink();

  return (
    <div className="flex items-center gap-2">
      <GuideMenu items={guideItems} />
      {surveyUrl && (
        <Button
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.sm}
          onClick={() => {
            window.open(surveyUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          <Icon name={ICON_NAME.emoticonSmile} aria-hidden={true} />
          {t('dashboard_surveyLink')}
        </Button>
      )}
    </div>
  );
};
