import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { OdsInputValueChangeEvent } from '@ovhcloud/ods-components/input';
import { useBuyCredit } from '@/hooks/useVouchers';

interface BuyCreditModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: (amount: number, url: string) => void;
  onError: (cause: Error) => void;
}

const isValidInputAmount = (amount: number) => {
  if (Number.isNaN(amount)) return false;
  if (!/^\d{1,8}$/.test(`${amount}`)) return false;
  if (Number(amount) <= 0) return false;
  return true;
};

export default function BuyCreditModal({
  projectId,
  onClose,
  onSuccess,
  onError,
}: BuyCreditModalProps) {
  const { t } = useTranslation('common');
  const env = useEnvironment();
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

  const handleInputChange = useCallback(
    (event: OdsInputValueChangeEvent) => {
      setAmount(Number(`${event.detail.value}`));
    },
    [setAmount],
  );

  return (
    <>
      <OsdsModal
        headline={t('cpb_vouchers_add_credit_title')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending && (
            <>
              <span>{t('cpb_vouchers_add_credit_info')}</span>
              <OsdsFormField>
                <OsdsText
                  slot="label"
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.default}
                >
                  {t('cpb_vouchers_add_credit_amount', {
                    currency: env.user?.currency?.symbol,
                  })}
                </OsdsText>
                <OsdsInput
                  type={ODS_INPUT_TYPE.number}
                  min={1}
                  value={amount}
                  onOdsValueChange={handleInputChange}
                  ariaLabel={t('cpb_vouchers_your_voucher')}
                  className={'border'}
                  data-testid="amountInput"
                />
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
          color={ODS_THEME_COLOR_INTENT.default}
          onClick={onClose}
        >
          {t('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(isValidInputAmount(amount) ? {} : { disabled: true })}
          onClick={() => buy(amount)}
          data-testid="submitButton"
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
