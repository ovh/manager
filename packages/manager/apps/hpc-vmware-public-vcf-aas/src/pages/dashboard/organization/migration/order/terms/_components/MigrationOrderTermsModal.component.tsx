import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsCheckbox,
  OdsLink,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { VcdaContract } from '@ovh-ux/manager-module-vcd-api';
import TEST_IDS from '@/utils/testIds.constants';

interface MigrationOrderTermsModalProps {
  contracts: VcdaContract[];
  isSubmitting: boolean;
  isError: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** The paying checkout is gated behind a mandatory contracts-acceptance checkbox. */
export default function MigrationOrderTermsModal({
  contracts,
  isSubmitting,
  isError,
  onConfirm,
  onClose,
}: MigrationOrderTermsModalProps) {
  const { t } = useTranslation('migration/order');
  const [accepted, setAccepted] = useState(false);

  return (
    <OdsModal
      isOpen
      isDismissible={!isSubmitting}
      onOdsClose={onClose}
      data-testid={TEST_IDS.migrationOrderTermsModal}
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('managed_vcd_migration_order_terms_title')}
      </OdsText>

      <div className="flex flex-col gap-4 mt-4">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('managed_vcd_migration_order_terms_intro')}
        </OdsText>

        {contracts.length > 0 && (
          <ul className="flex flex-col gap-1">
            {contracts.map((contract) => (
              <li key={contract.url || contract.name}>
                <OdsLink
                  href={contract.url}
                  target="_blank"
                  label={contract.name}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-row gap-2 items-start">
          <OdsCheckbox
            inputId="vcda-terms-accept"
            name="vcda-terms-accept"
            isChecked={accepted}
            isDisabled={isSubmitting || undefined}
            onClick={() => setAccepted(!accepted)}
            data-testid={TEST_IDS.migrationOrderTermsAccept}
          />
          <label htmlFor="vcda-terms-accept">
            <OdsText>{t('managed_vcd_migration_order_terms_accept')}</OdsText>
          </label>
        </div>

        {isError && (
          <OdsMessage color="danger" isDismissible={false}>
            {t('managed_vcd_migration_order_error_submit')}
          </OdsMessage>
        )}
      </div>

      <div className="flex gap-x-4 w-fit justify-self-center ml-auto mt-6">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t('managed_vcd_migration_order_terms_cancel')}
          isDisabled={isSubmitting || undefined}
          onClick={onClose}
          data-testid={TEST_IDS.migrationOrderTermsCancelCta}
        />
        <OdsButton
          label={t('managed_vcd_migration_order_terms_confirm')}
          isDisabled={!accepted || isSubmitting || undefined}
          isLoading={isSubmitting || undefined}
          onClick={onConfirm}
          data-testid={TEST_IDS.migrationOrderTermsConfirmCta}
        />
      </div>
    </OdsModal>
  );
}
