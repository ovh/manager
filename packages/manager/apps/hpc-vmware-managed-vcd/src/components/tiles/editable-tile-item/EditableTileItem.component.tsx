import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import TEST_IDS from '@/utils/testIds.constants';

type EditableTileItemProps = {
  value: string;
  name?: string;
  urn: string;
  isDisabled?: boolean;
  iamActions: string[];
  onClickEdit: () => void;
};

export default function EditableTileItem({
  value,
  name,
  urn,
  isDisabled,
  iamActions,
  onClickEdit,
}: EditableTileItemProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex justify-between items-center">
      <OdsText>{value}</OdsText>
      <div className="min-w-fit">
        <Suspense>
          <ManagerButton
            className="ml-6"
            data-testid={TEST_IDS.editButton}
            iamActions={iamActions}
            urn={urn}
            onClick={onClickEdit}
            variant="ghost"
            size="sm"
            icon="pen"
            label=""
            isDisabled={isDisabled}
            id={`editButton-${name || value}`}
            aria-label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
          />
        </Suspense>
      </div>
    </div>
  );
}
