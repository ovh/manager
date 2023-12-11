import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { useBuyCredit } from '@/hooks/useVouchers';

interface BuyCreditModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: (amount: number, url: string) => void;
  onError: (cause: Error) => void;
}

// @TODO retrieve this type from ODS
type OdsInputEvent = {
  detail: {
    value: string;
  };
};

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
    onError,
    onSuccess: (response) => onSuccess(response.amount, response.url),
  });

  const handleInputChange = useCallback(
    (event: OdsInputEvent) => {
      setAmount(Number(`${event.detail.value}`));
    },
    [setAmount],
  );

  return (
    <>
      <OsdsModal headline={t('cpb_vouchers_add_credit_title')}>
        <slot name="content">
          <span>{t('cpb_vouchers_add_credit_info')}</span>
          {!isPending && (
            <>
              <OsdsFormField>
                <OsdsText slot="label" level="heading" color="default">
                  {t('cpb_vouchers_add_credit_amount', {
                    currency: env.user?.currency?.symbol,
                  })}
                </OsdsText>
                <OsdsInput
                  type="number"
                  min={1}
                  value={amount}
                  onOdsValueChange={handleInputChange}
                  ariaLabel={t('cpb_vouchers_your_voucher')}
                />
              </OsdsFormField>
            </>
          )}
          {isPending && <OsdsSpinner inline size="md" />}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.default}
          onClick={() => onClose && onClose()}
        >
          {t('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(isValidInputAmount(amount) ? {} : { disabled: true })}
          onClick={() => buy(amount)}
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
