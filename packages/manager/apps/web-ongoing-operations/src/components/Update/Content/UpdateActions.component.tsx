import {
  OdsButton,
  OdsDivider,
  OdsMessage,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { TOngoingOperations } from '@/types';
import { ActionNameEnum } from '@/enum/actionName.enum';
import { urls } from '@/routes/routes.constant';

interface UpdateActionsProps {
  readonly data: TOngoingOperations;
  readonly actionName: ActionNameEnum;
  readonly disabled: boolean;
  readonly onValidate: (operationId?: number, type?: ActionNameEnum) => void;
  readonly updateActionName: (label: ActionNameEnum) => void;
}

export default function UpdateActions({
  data,
  actionName,
  disabled,
  onValidate,
  updateActionName,
}: UpdateActionsProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <>
      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._48}
      />
      <div className="flex flex-col gap-y-2">
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
            className={!data?.canRelaunch ? 'text-[#808080]' : ''}
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
            className={!data?.canAccelerate ? 'text-[#808080]' : ''}
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
            className={!data?.canCancel ? 'text-[#808080]' : ''}
          >
            {t('domain_operations_cancel_title')}
          </label>
        </div>

        {actionName === ActionNameEnum.CanAccelerate && (
          <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
            {t('domain_operations_accelerate_warning')}
          </OdsMessage>
        )}

        <div className={`flex gap-x-2`}>
          <OdsButton
            label={t('wizard_close')}
            slot="actions"
            onClick={() => {
              navigate(urls.root);
            }}
            variant={ODS_BUTTON_VARIANT.ghost}
          />
          <OdsButton
            label={t('wizard_confirm')}
            slot="actions"
            onClick={() => onValidate(data.id, actionName)}
            isDisabled={disabled}
          />
        </div>
      </div>
    </>
  );
}
