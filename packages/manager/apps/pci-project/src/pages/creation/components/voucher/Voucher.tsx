import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { CartConfiguration } from '@/data/models/Cart.type';
import { PROJECTS_TRACKING } from '@/tracking.constant';

import { useVoucher } from '../../hooks/useVoucher';

type VoucherProps = {
  cartId: string;
  itemId: number;
  voucherConfiguration: CartConfiguration | undefined;
  setVoucherConfiguration: (voucherConfiguration: CartConfiguration | undefined) => void;
  initialVoucher?: string | null;
};

export default function Voucher({
  cartId,
  itemId,
  voucherConfiguration,
  setVoucherConfiguration,
  initialVoucher,
}: VoucherProps) {
  const { t } = useTranslation(['new/voucher', NAMESPACES.ACTIONS]);

  const { trackClick } = useOvhTracking();

  const { voucher, setVoucher, error, voucherData, isPending, checkEligibility, handleRemove } =
    useVoucher({ cartId, itemId, setVoucherConfiguration, initialVoucher });

  return (
    <div className="pci-project-new-voucher">
      <OdsText preset="heading-3" className="mb-4">
        {t('pci_projects_new_voucher_title')}
      </OdsText>

      <div className="flex w-full items-center gap-4">
        <OdsFormField className="flex-1">
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="voucher"
            value={voucher}
            onOdsChange={(event) => setVoucher(event.detail.value as string)}
            placeholder={t('pci_projects_new_voucher_form_field_placeholder')}
            isDisabled={isPending}
            aria-label={t('pci_projects_new_voucher_form_field')}
          />
        </OdsFormField>
        <OdsButton
          onClick={() => {
            trackClick({
              actionType: 'action',
              actions: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.ADD_VOUCHER,
            });
            checkEligibility(voucher);
          }}
          type="submit"
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          isDisabled={!voucher}
          isLoading={isPending}
          size="sm"
          label={t('add', { ns: NAMESPACES.ACTIONS })}
        />
      </div>

      {error && (
        <OdsText preset="paragraph" className="text-critical">
          {t(error)}
        </OdsText>
      )}

      {voucherConfiguration && voucherData && (
        <div className="my-4 flex items-center gap-4" data-testid="voucher-section_display">
          <OdsButton
            data-testid="voucher-section_remove_button"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.critical}
            onClick={() => handleRemove(voucherConfiguration.id)}
            icon={ODS_ICON_NAME.trash}
            label=""
            size="sm"
          />

          <OdsText>
            {t('pci_projects_new_voucher_form_field_add_success', {
              credit: `${voucherData.credit.text}`,
            })}
          </OdsText>
        </div>
      )}
    </div>
  );
}
