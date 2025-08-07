import { FormField, Input, Text } from '@ovhcloud/ods-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useAddVoucher } from '@/api/hooks/useVouchers';

interface AddVoucherModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function AddVoucherModal({
  projectId,
  onClose,
  onSuccess,
  onError,
}: AddVoucherModalProps) {
  const { t } = useTranslation('common');
  const { add, isPending } = useAddVoucher({
    projectId: `${projectId}`,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });
  const [voucherCode, setVoucherCode] = useState('');

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVoucherCode(event.target.value);
    },
    [setVoucherCode],
  );

  return (
    <PciModal
      title={t('cpb_vouchers_your_voucher_add')}
      data-testid="AddVoucherModal-modal"
      onClose={onClose}
      onConfirm={() => add(voucherCode)}
      onCancel={onClose}
      isPending={isPending}
      isDisabled={isPending || !voucherCode}
    >
      <FormField>
        <Text preset="label">{t('cpb_vouchers_your_voucher')}</Text>
        <Input
          type="text"
          color="primary"
          onChange={handleInputChange}
          aria-label={t('cpb_vouchers_your_voucher')}
          data-testid="voucherId"
        />
      </FormField>
    </PciModal>
  );
}
