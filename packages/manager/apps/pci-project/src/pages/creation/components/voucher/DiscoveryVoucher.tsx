import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TEligibilityVoucher } from '@/data/types/eligibility.type';
import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';

type DiscoveryVoucherProps = {
  voucher: TEligibilityVoucher['credit'];
};

export default function DiscoveryVoucher({ voucher }: DiscoveryVoucherProps) {
  const { t } = useTranslation('new/voucher');

  return (
    <div className="pci-project-new-voucher">
      <OdsText preset="heading-3" className="mb-4">
        {t('pci_projects_new_voucher_title')}
      </OdsText>

      <div className="flex items-center w-full gap-4">
        <OdsFormField className="flex-1">
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="voucher"
            value={DISCOVERY_PROMOTION_VOUCHER}
            placeholder={t('pci_projects_new_voucher_form_field_placeholder')}
            isDisabled={true}
            aria-label={t('pci_projects_new_voucher_form_field')}
          />
        </OdsFormField>
        <OdsButton
          type="submit"
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          size="sm"
          isDisabled={true}
          label={t('pci_projects_new_voucher_form_add')}
        />
      </div>

      <div
        className="flex items-center gap-4 my-4"
        data-testid="voucher-section_display"
      >
        <OdsText>
          {t('pci_projects_new_voucher_form_field_add_success', {
            credit: voucher.text,
          })}
        </OdsText>
      </div>
    </div>
  );
}
