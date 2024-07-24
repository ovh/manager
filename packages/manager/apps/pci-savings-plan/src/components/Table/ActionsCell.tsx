import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsMenu,
  OsdsMenuItem,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  SavingsPlanPlanedChangeStatus,
  SavingsPlanStatus,
} from '@/types/api.type';

interface SavingsPlanActionsCell {
  onClickManage: (path: string) => void;
  onClickDelete: () => void;
  id: string;
  status: SavingsPlanStatus;
  periodEndAction: SavingsPlanPlanedChangeStatus;
}

export default function ActionsCell({
  status,
  periodEndAction,
  id,
  onClickDelete,
  onClickManage,
}: Readonly<SavingsPlanActionsCell>) {
  const editable = true;
  const { t } = useTranslation('listing');

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
      {status === SavingsPlanStatus.ACTIVE && (
        <OsdsMenuItem>
          <OsdsButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            text-align="start"
            onClick={() => onClickManage(id)}
          >
            <span slot="start">
              <span>{t('edit')}</span>
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
          onClick={() => onClickManage(id)}
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
    </OsdsMenu>
  );
}
