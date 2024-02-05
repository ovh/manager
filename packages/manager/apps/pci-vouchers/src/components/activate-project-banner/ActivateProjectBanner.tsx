import { OsdsButton, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

export default function ActivateProjectBanner({
  projectId,
}: {
  projectId: string;
}) {
  const [t] = useTranslation('activate-project-banner');
  const { navigateTo } = useNavigation();
  const activateDiscoveryProject = async () => {
    await navigateTo(
      'public-cloud',
      `#/pci/projects/${projectId}/activate`,
      {},
    );
  };
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
          onClick={activateDiscoveryProject}
        >
          {t('pci_projects_project_activate_project_banner_cta')}
        </OsdsButton>
      </div>
    </OsdsMessage>
  );
}
