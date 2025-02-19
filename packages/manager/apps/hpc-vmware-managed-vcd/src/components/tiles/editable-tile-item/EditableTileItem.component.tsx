import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';

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
      <OdsText className="break-all">{label}</OdsText>
      <div className="min-w-fit">
        <Suspense>
          <ManagerButton
            className="ml-6"
            data-testid="editIcon"
            iamActions={iamActions}
            urn={urn}
            onClick={onClickEdit}
            variant="ghost"
            size="sm"
            icon="pen"
            label=""
            id={`editIcon-${label}`}
            aria-label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
          />
        </Suspense>
      </div>
    </div>
  );
}
