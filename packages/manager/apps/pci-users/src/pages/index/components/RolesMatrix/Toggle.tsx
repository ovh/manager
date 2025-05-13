import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

interface IProps {
  toggled: boolean;
  onToggle: (value: boolean) => void;
}

export default function Toggle({ toggled, onToggle }: IProps) {
  const { t } = useTranslation('common');
  return (
    <div>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="inline-block"
        onClick={() => onToggle(!toggled)}
      >
        {toggled
          ? t('pci_projects_project_users_matrix_hide')
          : t('pci_projects_project_users_matrix_show')}
      </OsdsButton>
    </div>
  );
}
