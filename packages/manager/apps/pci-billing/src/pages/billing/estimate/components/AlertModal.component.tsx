import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { QuantitySelector } from '@ovh-ux/manager-pci-common';
import { useContext, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { isValidEmail } from '@/pages/billing/estimate/utils';

type TAlertModalProps = {
  email?: string;
  threshold?: number;
  onClose: () => void;
  onInput: (val: { email: string; threshold: number }) => void;
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
}: TAlertModalProps): JSX.Element => {
  const { t: tEstimate } = useTranslation('estimate');
  const { currency } = useContext(ShellContext).environment.getUser();
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
    <OsdsModal onOdsModalClose={onClose}>
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
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
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
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
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
      <OsdsButton
        slot="actions"
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClose}
      >
        {tEstimate('cpbea_estimate_alert_add_cancel_btn')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        onClick={() =>
          onInput({ email: state.email.value, threshold: state.threshold })
        }
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...(!state.email.isValid || state.threshold === 0
          ? { disabled: true }
          : {})}
      >
        {tEstimate('cpbea_estimate_alert_add_submit_btn')}
      </OsdsButton>
    </OsdsModal>
  );
};
