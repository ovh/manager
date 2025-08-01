import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

const WelcomeMessage = (): JSX.Element => {
  const { t } = useTranslation('preloader');
  return (
    <>
      <p>{t('welcome_title')}</p>
      <OsdsText
        className="font-normal"
        size={ODS_THEME_TYPOGRAPHY_SIZE._700}
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
      >
        {t('welcome_subtitle')}
      </OsdsText>
    </>
  );
};

export default WelcomeMessage;
