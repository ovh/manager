import React from 'react';
import { useTranslation } from 'react-i18next';
import { Description } from '@ovh-ux/manager-react-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type EditableTileItemProps = {
  label: string;
  onClickEdit: () => void;
};

export default function EditableTileItem({
  label,
  onClickEdit,
}: EditableTileItemProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex justify-between items-center">
      <Description className="break-all">{label}</Description>
      <div>
        <OsdsIcon
          aria-label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
          className="mx-6 cursor-pointer"
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onClickEdit}
          data-testid="editIcon"
        />
      </div>
    </div>
  );
}
