import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { PciModal, QuantitySelector } from '@ovh-ux/manager-pci-common';
import { useState } from 'react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Currency } from '@ovh-ux/manager-config';
import { isValidEmail } from '@/pages/billing/estimate/utils';

export type TAlertModalProps = {
  email?: string;
  threshold?: number;
  onClose: () => void;
  onInput: (val: { email: string; threshold: number }) => void;
  isPending: boolean;
  currency: Currency;
};

type TState = {
  email: {
    value: string;
    isTouched: boolean;
    isValid: boolean;
  };
  threshold: number;
};

export const AlertModalComponent = ({
  email,
  threshold,
  onClose,
  onInput,
  isPending,
  currency,
}: TAlertModalProps): JSX.Element => {
  const { t: tEstimate } = useTranslation('estimate');
  const { t } = useTranslation('estimate');
  const [state, setState] = useState<TState>({
    email: {
      value: email || '',
      isTouched: false,
      isValid: isValidEmail(email || ''),
    },
    threshold: threshold || 0,
  });

  return (
    <PciModal
      title={tEstimate('cpbea_estimate_alert_add_header_title')}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={() =>
        onInput({ email: state.email.value, threshold: state.threshold })
      }
      cancelText={tEstimate('cpbea_estimate_alert_add_cancel_btn')}
      submitText={tEstimate('cpbea_estimate_alert_add_submit_btn')}
      isDisabled={!state.email.isValid || state.threshold === 0}
      isPending={isPending}
    >
      <OsdsFormField
        error={
          state.email.isTouched && !state.email.isValid
            ? `${tEstimate(
                'cpbea_estimate_alert_add_mail_required',
              )} ${tEstimate('cpbea_estimate_alert_add_mail_bad_format')}`
            : ''
        }
      >
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('cpbea_estimate_alert_add_mail_label')}
        </OsdsText>
        <OsdsInput
          error={state.email.isTouched && !state.email.isValid}
          value={state.email.value}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(event) => {
            setState((prev) => ({
              ...prev,
              email: {
                value: event.detail.value,
                isTouched: true,
                isValid: isValidEmail(event.detail.value),
              },
            }));
          }}
        />
      </OsdsFormField>
      <OsdsFormField>
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('cpbea_estimate_alert_add_threshold_label', {
            currency: currency.symbol,
          })}
        </OsdsText>
        <QuantitySelector
          value={state.threshold}
          min={0}
          max={9999999}
          onValueChange={(newVal) => {
            setState((prev) => ({
              ...prev,
              threshold: newVal,
            }));
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
};
