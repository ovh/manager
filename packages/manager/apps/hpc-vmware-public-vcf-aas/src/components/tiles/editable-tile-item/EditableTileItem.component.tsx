import { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerButton } from '@ovh-ux/manager-react-components';

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
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <div className="flex items-center justify-between">
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
            aria-label={tActions('modify')}
          />
        </Suspense>
      </div>
    </div>
  );
}
