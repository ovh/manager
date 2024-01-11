import {
  OsdsButton,
  OsdsModal,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInputValueChangeEvent } from '@ovhcloud/ods-components/input';
import { useAddVoucher } from '@/hooks/useVouchers';

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
    onError,
    onSuccess,
  });
  const [voucherCode, setVoucherCode] = useState('');

  const handleInputChange = useCallback(
    (event: OdsInputValueChangeEvent) => {
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
                <OsdsText
                  slot="label"
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.default}
                >
                  {t('cpb_vouchers_your_voucher')}
                </OsdsText>
                <OsdsInput
                  type="text"
                  className={'border'}
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
