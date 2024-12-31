import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import { usePciUrl } from '@ovh-ux/manager-pci-common';
import {
  SavingsPlanPlanedChangeStatus,
  SavingsPlanStatus,
} from '@/types/api.type';

interface SavingsPlanActionsCell {
  onClickEditName: (path: string) => void;
  onClickRenew: () => void;
  id: string;
  flavor: string;
  status: SavingsPlanStatus;
  periodEndAction: SavingsPlanPlanedChangeStatus;
}

const MenuItems = ({
  status,
  flavor,
  onClickEdit,
  onClickRenew,
  periodEndAction,
  pciUrl,
}: {
  status: SavingsPlanStatus;
  flavor: string;
  onClickEdit: () => void;
  onClickRenew: () => void;
  periodEndAction: SavingsPlanPlanedChangeStatus;
  pciUrl: string;
}) => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  // We don't have a better way to check that, api return only a specific code and not an id related to scope (instance, rancher),
  // So if we have number in the flavor (b3-8, c3-16) it's an instance else it's a Rancher
  const isInstance = useMemo(() => /\d/.test(flavor), [flavor]);

  return (
    <>
      <div id="popover-trigger">
        <OdsButton
          label={t('edit')}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          onClick={onClickEdit}
        />
      </div>

      <OdsPopover triggerId="popover-trigger">
        {status !== SavingsPlanStatus.TERMINATED && (
          <OdsButton
            label={
              periodEndAction === SavingsPlanPlanedChangeStatus.TERMINATE
                ? t('enableAutoRenew')
                : t('disableAutoRenew')
            }
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            text-align="start"
            onClick={onClickRenew}
          />
        )}

        <OdsButton
          label={t(isInstance ? 'order_instance' : 'order_rancher')}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          onClick={() =>
            isInstance
              ? navigate(`${pciUrl}/instances/new`)
              : navigate(`${pciUrl}/rancher/new`)
          }
        />
      </OdsPopover>
    </>
  );
};

export default function ActionsCell({
  status,
  periodEndAction,
  id,
  flavor,
  onClickEditName,
  onClickRenew,
}: Readonly<SavingsPlanActionsCell>) {
  const pciUrl = usePciUrl();

  const editable = true;

  const onClickEdit = useCallback(() => onClickEditName(id), [id]);

  return (
    <>
      <OdsButton
        icon={ODS_ICON_NAME.ellipsisVertical}
        variant={ODS_BUTTON_VARIANT.outline}
        size={ODS_BUTTON_SIZE.sm}
        isDisabled={!editable || undefined}
        label="action-menu"
      />
      <MenuItems
        pciUrl={pciUrl}
        flavor={flavor}
        status={status}
        periodEndAction={periodEndAction}
        onClickEdit={onClickEdit}
        onClickRenew={onClickRenew}
      />
    </>
  );
}
