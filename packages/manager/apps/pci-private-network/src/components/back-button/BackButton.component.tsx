import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { resetNetworks } from '@/queryClient';

const BackButton: React.FC = () => {
  const { t } = useTranslation('common');
  const backHref = useHref('..');
  const { data: project } = useProject();
  const { clearNotifications } = useNotifications();

  return (
    <OsdsLink
      data-testid="back-btn"
      color={ODS_THEME_COLOR_INTENT.primary}
      className="mt-10"
      href={backHref}
      onClick={async () => {
        await resetNetworks(project.project_id);
        clearNotifications();
      }}
    >
      <OsdsIcon
        slot="start"
        name={ODS_ICON_NAME.ARROW_LEFT}
        size={ODS_ICON_SIZE.xs}
        color={ODS_THEME_COLOR_INTENT.primary}
      ></OsdsIcon>
      <span className="ml-4">
        {t('common_back_button_back_to_previous_page')}
      </span>
    </OsdsLink>
  );
};

export default BackButton;
