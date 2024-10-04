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
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    <>
      <OsdsModal
        headline={t('cpb_vouchers_your_voucher_add')}
        data-testid="AddVoucherModal-modal"
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending && (
            <>
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
                  className="border"
                  onOdsValueChange={handleInputChange}
                  ariaLabel={t('cpb_vouchers_your_voucher')}
                  data-testid="voucherId"
                />
              </OsdsFormField>
            </>
          )}
          {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
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
          {...(voucherCode ? {} : { disabled: true })}
          onClick={() => add(voucherCode)}
          data-testid="submitButton"
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
