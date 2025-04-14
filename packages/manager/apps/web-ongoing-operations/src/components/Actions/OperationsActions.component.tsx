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
import { OperationName } from '@/enum/operationName.enum';
import { urls } from '@/routes/routes.constant';

interface OperationActionsProps {
  readonly data: TOngoingOperations;
  readonly operationName: OperationName;
  readonly disabled: boolean;
  readonly onValidate: (operationId?: number, type?: OperationName) => void;
  readonly putOperationName: (label: OperationName) => void;
  readonly justify: string;
}

export default function OperationActions({
  data,
  operationName,
  disabled,
  onValidate,
  putOperationName,
  justify,
}: OperationActionsProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-1">
        <OdsRadio
          inputId="radio-relaunch"
          name="radio-format"
          onOdsChange={() => {
            putOperationName(OperationName.CanRelaunch);
          }}
          isChecked={data.canRelaunch}
          isDisabled={!data.canRelaunch}
        ></OdsRadio>
        <label
          htmlFor="radio-relaunch"
          className="form-field__radio__field__label"
        >
          {t('domain_operations_relaunch_title')}
        </label>
      </div>

      <div className="flex items-center gap-x-1">
        <OdsRadio
          inputId="radio-accelerate"
          name="radio-format"
          isDisabled={!data.canAccelerate}
          onOdsChange={() => {
            putOperationName(OperationName.CanAccelerate);
          }}
        ></OdsRadio>
        <label
          htmlFor="radio-accelerate"
          className="form-field__radio__field__label"
        >
          {t('domain_operations_accelerate_title')}
        </label>
      </div>

      <div className="flex items-center gap-x-1">
        <OdsRadio
          inputId="radio-cancel"
          name="radio-format"
          isDisabled={!data.canCancel}
          onOdsChange={() => {
            putOperationName(OperationName.CanCancel);
          }}
        ></OdsRadio>
        <label
          htmlFor="radio-cancel"
          className="form-field__radio__field__label"
        >
          {t('domain_operations_cancel_title')}
        </label>
      </div>

      {operationName === OperationName.CanAccelerate && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          {t('domain_operations_accelerate_warning')}
        </OdsMessage>
      )}

      <div className={`flex justify-${justify} gap-x-2`}>
        <OdsButton
          label={t('wizard_cancel')}
          slot="actions"
          onClick={() => {
            putOperationName(null);
            navigate(urls.root);
          }}
          variant={ODS_BUTTON_VARIANT.ghost}
        />
        <OdsButton
          label={t('wizard_confirm')}
          slot="actions"
          onClick={() => onValidate(data.id, operationName)}
          isDisabled={disabled && operationName === null}
        />
      </div>
    </div>
  );
}
