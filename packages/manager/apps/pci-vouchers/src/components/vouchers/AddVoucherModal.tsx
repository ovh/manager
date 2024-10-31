import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
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
    (event: OdsInputValueChangeEvent) => {
      setVoucherCode(`${event.detail.value}`);
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
      <OsdsFormField>
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('cpb_vouchers_your_voucher')}
        </OsdsText>
        <OsdsInput
          type={ODS_INPUT_TYPE.text}
          color={ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={handleInputChange}
          ariaLabel={t('cpb_vouchers_your_voucher')}
          data-testid="voucherId"
        />
      </OsdsFormField>
    </PciModal>
  );
}
