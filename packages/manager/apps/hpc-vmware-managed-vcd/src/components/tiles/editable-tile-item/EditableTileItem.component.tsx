import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Description, ManagerButton } from '@ovh-ux/manager-react-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import Loading from '@/components/loading/Loading.component';

type EditableTileItemProps = {
  label: string;
  urn: string;
  iamActions: string[];
  onClickEdit: () => void;
};

export default function EditableTileItem({
  label,
  urn,
  iamActions,
  onClickEdit,
}: EditableTileItemProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex justify-between items-center">
      <Description className="break-all">{label}</Description>
      <Suspense fallback={<Loading />}>
        <ManagerButton
          className="ml-6"
          data-testid="editIcon"
          iamActions={iamActions}
          urn={urn}
          onClick={onClickEdit}
          circle
          variant={ODS_BUTTON_VARIANT.ghost}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
        >
          <OsdsIcon
            aria-label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
            name={ODS_ICON_NAME.PEN}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </ManagerButton>
      </Suspense>
    </div>
  );
}
