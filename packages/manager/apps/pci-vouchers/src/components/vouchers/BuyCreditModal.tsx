import { FormField, FormFieldError, Input, Text } from '@ovhcloud/ods-react';

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(parseInt(event.target.value, 10));
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
      <Text preset="paragraph">{t('cpb_vouchers_add_credit_info')}</Text>
      <FormField
        className="mt-6"
        invalid={!isValidInputAmount || !isMinimalAmount}
      >
        <Text preset="label">
          {t('cpb_vouchers_add_credit_amount', {
            currency: user.currency.symbol,
          })}
        </Text>
        <Input
          type="number"
          min={1}
          value={amount}
          color={
            !isValidInputAmount || !isMinimalAmount ? 'critical' : 'default'
          }
          onChange={handleInputChange}
          aria-label={t('cpb_vouchers_your_voucher')}
          data-testid="amountInput"
        />

        {!isMinimalAmount && (
          <FormFieldError>
            {t('common_field_error_min', {
              min: 1,
            })}
          </FormFieldError>
        )}

        {!isValidInputAmount && (
          <FormFieldError>{t('common_field_error_number')}</FormFieldError>
        )}
      </FormField>
    </PciModal>
  );
}
