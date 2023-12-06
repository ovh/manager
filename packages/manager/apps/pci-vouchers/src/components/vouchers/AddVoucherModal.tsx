import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddVoucher } from '@/hooks/useVouchers';

interface AddVoucherModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

// @TODO retrieve this type from ODS
type OdsInputEvent = {
  detail: {
    value: string;
  };
};

export default function AddVoucherModal({
  projectId,
  onClose,
  onSuccess,
  onError,
}: AddVoucherModalProps) {
  const { t } = useTranslation('common');
  const { add, isPending } = useAddVoucher({
    projectId: `${projectId}`,
    onError,
    onSuccess,
  });
  const [voucherCode, setVoucherCode] = useState('');

  const handleInputChange = useCallback(
    (event: OdsInputEvent) => {
      setVoucherCode(`${event.detail.value}`);
    },
    [setVoucherCode],
  );

  return (
    <>
      <OsdsModal headline={t('cpb_vouchers_your_voucher_add')}>
        <slot name="content">
          {!isPending && (
            <>
              <OsdsFormField>
                <OsdsText slot="label" level="heading" color="default">
                  {t('cpb_vouchers_your_voucher')}
                </OsdsText>
                <OsdsInput
                  type="text"
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
          {...(voucherCode ? {} : { disabled: true })}
          onClick={() => add(voucherCode)}
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
