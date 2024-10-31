import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { PciModal } from '@ovh-ux/manager-pci-common';
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
    <PciModal
      data-testid="BuyCreditPage-modal"
      title={t('cpb_vouchers_add_credit_title')}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={() => buy(amount)}
      isPending={isPending}
      isDisabled={isPending || !isValidInputAmount}
      submitText={t('cpb_vouchers_add_credit_valid')}
    >
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('cpb_vouchers_add_credit_info')}
      </OsdsText>
      <OsdsFormField className="mt-6">
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
          color={
            !isValidInputAmount || !isMinimalAmount
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.default
          }
          onOdsValueChange={handleInputChange}
          ariaLabel={t('cpb_vouchers_your_voucher')}
          error={!isValidInputAmount || !isMinimalAmount}
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
    </PciModal>
  );
}
