import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsRadio,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { TOngoingOperations } from "@/interface";

interface ModalActionsComponentProps {
  onCloseModal: any;
  doOperation: any;
  data: TOngoingOperations;
}

interface ActionsList {
  canRelaunch: boolean;
  canAccelerate: boolean;
  canCancel: boolean;
}

export default function ModalActionsComponent({
  data,
  onCloseModal,
  doOperation,
}: ModalActionsComponentProps) {
  const { t } = useTranslation('dashboard');
  const [canRelaunch, setCanRelaunch] = useState<boolean>(false);
  const [canAccelerate, setCanAccelerate] = useState<boolean>(false);
  const [canCancel, setCanCancel] = useState(false);

  const operationType = () => {
    switch (true) {
      case canRelaunch:
        return 'relaunch';
      case canAccelerate:
        return 'accelerate';
      case canCancel:
        return 'cancel';
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-1">
        <OdsRadio
          inputId="radio-relaunch"
          name="radio-format"
          onOdsChange={() => setCanRelaunch(true)}
          isDisabled={!data?.canRelaunch}
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
          isDisabled={!data?.canAccelerate}
          onOdsChange={() => setCanAccelerate(true)}
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
          isDisabled={!data?.canCancel}
          onOdsChange={() => setCanCancel(true)}
        ></OdsRadio>
        <label
          htmlFor="radio-cancel"
          className="form-field__radio__field__label"
        >
          {t('domain_operations_cancel_title')}
        </label>
      </div>

      {canAccelerate && (
        <OdsMessage color="warning" isDismissible={false}>{ t('domain_operations_accelerate_warning') }</OdsMessage>
      )
      }

      <div className="flex justify-end">
        <OdsButton
          label={t('wizard_cancel')}
          slot="actions"
          onClick={onCloseModal}
          variant="ghost"
        />
        <OdsButton
          label={t('wizard_confirm')}
          slot="actions"
          isDisabled={!canRelaunch && !canAccelerate && !canCancel}
          onClick={() => doOperation(data.id, operationType())}
        />
      </div>
    </div>
  );
}
