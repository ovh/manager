import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { useSurveyLink } from '@/hooks/useSurveyLink';

export const SurveyLink = () => {
  const { t } = useTranslation('dashboard');
  const surveyUrl = useSurveyLink();

  return (
    <span className="whitespace-nowrap">
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
    </span>
  );
};
