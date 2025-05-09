import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsLink, OdsPopover } from '@ovhcloud/ods-components/react';
import { usePciUrl } from '@ovh-ux/manager-pci-common';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  SavingsPlanPlanedChangeStatus,
  SavingsPlanStatus,
} from '@/types/api.type';
import './ActionCell.scss';
import { isInstanceFlavor } from '@/utils/savingsPlan';

interface SavingsPlanActionsCell {
  onClickEditName: (path: string) => void;
  onClickRenew: () => void;
  id: string;
  flavor: string;
  status: SavingsPlanStatus;
  periodEndAction: SavingsPlanPlanedChangeStatus;
}

const MenuItems = ({
  id,
  status,
  flavor,
  onClickEdit,
  onClickRenew,
  periodEndAction,
  pciUrl,
}: {
  id: string;
  status: SavingsPlanStatus;
  flavor: string;
  onClickEdit: () => void;
  onClickRenew: () => void;
  periodEndAction: SavingsPlanPlanedChangeStatus;
  pciUrl: string;
}) => {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();

  const isInstance = useMemo(() => isInstanceFlavor(flavor), [flavor]);

  return (
    <OdsPopover triggerId={`popover-trigger-${id}`}>
      <div className="flex flex-col gap-2">
        <OdsButton
          label={t('edit')}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          onClick={onClickEdit}
        />
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

        <OdsLink
          href={
            isInstance ? `${pciUrl}/instances/new` : `${pciUrl}/rancher/new`
          }
          className="menu-item-link"
          label={t(isInstance ? 'order_instance' : 'order_rancher')}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: [`add_instance_${flavor}`],
            });
          }}
        />
      </div>
    </OdsPopover>
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
  const { trackClick } = useOvhTracking();

  return (
    <>
      <div id={`popover-trigger-${id}`}>
        <OdsButton
          label=""
          icon={ODS_ICON_NAME.ellipsisVertical}
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BUTTON_SIZE.sm}
          isDisabled={!editable || undefined}
        />
      </div>
      <MenuItems
        id={id}
        pciUrl={pciUrl}
        flavor={flavor}
        status={status}
        periodEndAction={periodEndAction}
        onClickEdit={onClickEdit}
        onClickRenew={() => {
          onClickRenew();
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: [`activate_automatic_renew_${flavor}`],
          });
        }}
      />
    </>
  );
}
