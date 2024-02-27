import { OsdsButton, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export default function ActivateProjectBanner() {
  const [t] = useTranslation('activate-project-banner');
  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_THEME_COLOR_INTENT.warning}
      className={'mt-3 flex-row'}
    >
      <div className={'flex flex-row justify-between'}>
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_project_activate_project_banner_message'),
          }}
        ></span>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('pci_projects_project_activate_project_banner_cta')}
        </OsdsButton>
      </div>
    </OsdsMessage>
  );
}
