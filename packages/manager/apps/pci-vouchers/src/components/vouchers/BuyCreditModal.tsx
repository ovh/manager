import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useBuyCredit } from '@/api/hooks/useVouchers';

interface BuyCreditModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: (amount: number, url: string) => void;
  onError: (cause: Error) => void;
}

export default function BuyCreditModal({
  projectId,
  onClose,
  onSuccess,
  onError,
}: BuyCreditModalProps) {
  const { t } = useTranslation('common');
  const user = useContext(ShellContext).environment.getUser();
  const [amount, setAmount] = useState(10);
  const { buy, isPending } = useBuyCredit({
    projectId: `${projectId}`,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: (response) => {
      onClose();
      onSuccess(response.amount, response.url);
    },
  });

  const isMinimalAmount = !Number.isNaN(amount) && amount >= 1;

  const isValidInputAmount = !!(
    !Number.isNaN(amount) &&
    amount > 0 &&
    amount <= 200_000
  );

  const handleInputChange = useCallback(
    (event: OdsInputValueChangeEvent) => {
      setAmount(parseInt(`${event.detail.value}`, 10));
    },
    [setAmount],
  );

  return (
    <>
      <OsdsModal
        data-testid="BuyCreditPage-modal"
        headline={t('cpb_vouchers_add_credit_title')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending && (
            <>
              <span>{t('cpb_vouchers_add_credit_info')}</span>
              <OsdsFormField className="pt-4">
                <OsdsText
                  slot="label"
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('cpb_vouchers_add_credit_amount', {
                    currency: user.currency.symbol,
                  })}
                </OsdsText>
                <OsdsInput
                  type={ODS_INPUT_TYPE.number}
                  min={1}
                  value={amount}
                  onOdsValueChange={handleInputChange}
                  ariaLabel={t('cpb_vouchers_your_voucher')}
                  {...(isValidInputAmount && isMinimalAmount
                    ? {}
                    : { color: ODS_THEME_COLOR_INTENT.error })}
                  className={`border ${
                    isValidInputAmount && isMinimalAmount
                      ? ''
                      : 'border-red-500'
                  }`}
                  {...(isValidInputAmount && isMinimalAmount
                    ? {}
                    : { error: true })}
                  data-testid="amountInput"
                />

                {!isMinimalAmount && (
                  <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.error}>
                    {t('common_field_error_min', {
                      min: 1,
                    })}
                  </OsdsText>
                )}

                {!isValidInputAmount && (
                  <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.error}>
                    {t('common_field_error_number')}
                  </OsdsText>
                )}
              </OsdsFormField>
            </>
          )}
          {isPending && (
            <div>
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            </div>
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        >
          {t('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(isValidInputAmount && isMinimalAmount ? {} : { disabled: true })}
          onClick={() => buy(amount)}
          data-testid="submitButton"
        >
          {t('cpb_vouchers_add_credit_valid')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
