import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
} from '@ovhcloud/ods-components/react';
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

  // We don't have a better way to check that, api return only a specific code and not an id related to scope (instance, rancher),
  // So if we have number in the flavor (b3-8, c3-16) it's an instance else it's a Rancher
  const isInstance = /\d/.test(flavor);

  return (
    <>
      <OsdsMenuItem>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          onClick={onClickEdit}
        >
          <span slot="start">
            <span>{t('edit')}</span>
          </span>
        </OsdsButton>
      </OsdsMenuItem>

      {status !== SavingsPlanStatus.TERMINATED && (
        <OsdsMenuItem>
          <OsdsButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            text-align="start"
            onClick={onClickRenew}
          >
            <span slot="start">
              <span>
                {periodEndAction === SavingsPlanPlanedChangeStatus.TERMINATE
                  ? t('enableAutoRenew')
                  : t('disableAutoRenew')}
              </span>
            </span>
          </OsdsButton>
        </OsdsMenuItem>
      )}

      <OsdsMenuItem>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          href={
            isInstance ? `${pciUrl}/instances/new` : `${pciUrl}/rancher/new`
          }
        >
          <span slot="start">
            <span>{t(isInstance ? 'order_instance' : 'order_rancher')}</span>
          </span>
        </OsdsButton>
      </OsdsMenuItem>
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
    <OsdsMenu className="absolute  mt-[-15px]">
      <OsdsButton
        slot="menu-title"
        inline
        circle
        color={ODS_THEME_COLOR_INTENT.info}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        disabled={!editable || undefined}
      >
        <OsdsIcon
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.ELLIPSIS}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
      <MenuItems
        pciUrl={pciUrl}
        flavor={flavor}
        status={status}
        periodEndAction={periodEndAction}
        onClickEdit={onClickEdit}
        onClickRenew={onClickRenew}
      />
    </OsdsMenu>
  );
}
