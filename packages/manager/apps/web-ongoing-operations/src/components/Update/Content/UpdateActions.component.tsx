import {
  OdsButton,
  OdsMessage,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { TOngoingOperations } from '@/types';
import { ActionNameEnum } from '@/enum/actionName.enum';
import { urls } from '@/routes/routes.constant';

interface UpdateActionsProps {
  readonly data: TOngoingOperations;
  readonly actionName: ActionNameEnum;
  readonly disabled: boolean;
  readonly isActionLoading: boolean;
  readonly onValidate: () => void;
  readonly updateActionName: (label: ActionNameEnum) => void;
}

export default function UpdateActions({
  data,
  actionName,
  disabled,
  isActionLoading,
  onValidate,
  updateActionName,
}: UpdateActionsProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-y-2 mt-8">
      <div className="flex items-center gap-x-2">
        <OdsRadio
          inputId="radio-relaunch"
          name="radio-format"
          onOdsChange={() => {
            updateActionName(ActionNameEnum.CanRelaunch);
          }}
          isDisabled={!data.canRelaunch}
        ></OdsRadio>
        <label
          htmlFor="radio-relaunch"
          className={
            !data?.canRelaunch
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {t('domain_operations_relaunch_title')}
        </label>
      </div>

      <div className="flex items-center gap-x-2">
        <OdsRadio
          inputId="radio-accelerate"
          name="radio-format"
          isDisabled={!data.canAccelerate}
          onOdsChange={() => {
            updateActionName(ActionNameEnum.CanAccelerate);
          }}
        ></OdsRadio>
        <label
          htmlFor="radio-accelerate"
          className={
            !data?.canAccelerate
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {t('domain_operations_accelerate_title')}
        </label>
      </div>

      <div className="flex items-center gap-x-2">
        <OdsRadio
          inputId="radio-cancel"
          name="radio-format"
          isDisabled={!data.canCancel}
          onOdsChange={() => {
            updateActionName(ActionNameEnum.CanCancel);
          }}
        ></OdsRadio>
        <label
          htmlFor="radio-cancel"
          className={
            !data?.canCancel
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {t('domain_operations_cancel_title')}
        </label>
      </div>

      {actionName === ActionNameEnum.CanAccelerate && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          {t('domain_operations_accelerate_warning')}
        </OdsMessage>
      )}

      <div className="flex gap-x-2 mt-8">
        <OdsButton
          label={t('wizard_cancel')}
          slot="actions"
          onClick={() => {
            navigate(urls.root);
          }}
          variant={ODS_BUTTON_VARIANT.ghost}
        />
        <OdsButton
          label={t('wizard_confirm')}
          slot="actions"
          onClick={() => onValidate()}
          isDisabled={disabled}
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
}
