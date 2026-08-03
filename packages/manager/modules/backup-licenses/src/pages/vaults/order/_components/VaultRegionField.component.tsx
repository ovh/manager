import React from 'react';

import { Control, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsFormField, OdsMessage, OdsSelect, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { FieldError } from '@/components/FieldError/FieldError.component';
import { Location } from '@/types/Location.type';
import { formatLocationTitle } from '@/utils/locationLabel/locationLabel';

import { VaultOrderFormValues } from '../_hooks/useVaultOrderForm.hook';

export const VAULT_ORDER_REGION_FIELD_ID = 'vault-order-region';
export const VAULT_ORDER_REGION_CONTROL_ID = `${VAULT_ORDER_REGION_FIELD_ID}-control`;

/**
 * No hint under this field, deliberately: the region cannot be changed afterwards, but R5 has that as
 * a consequence of what the contract can express, not as a promise any ticket makes to the customer —
 * so the funnel's "This choice is final" is not carried over here.
 */
export const VaultRegionField = ({
  control,
  isDisabled,
  locations,
  isPending,
  isError,
}: {
  control: Control<VaultOrderFormValues>;
  isDisabled: boolean;
  locations?: Location[];
  isPending: boolean;
  isError: boolean;
}) => {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.VAULTS,
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  // The region label belongs to the referential this list already carries, and `formatLocationTitle`
  // is where the funnel reads it from — one source, so the modal, the funnel and the Region column
  // name a region identically and no machine code can reach the customer.
  const { t: tOrder } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const {
    field: { ref: registerControl, ...field },
    fieldState: { error },
  } = useController({ control, name: 'region' });

  const label = t('order.field.region.label');

  const renderControl = () => {
    if (isPending) {
      return <OdsSkeleton />;
    }

    if (isError) {
      return (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
          {t(`${NAMESPACES.ERROR}:error_loading_page`)}
        </OdsMessage>
      );
    }

    return (
      <OdsSelect
        ref={registerControl}
        id={VAULT_ORDER_REGION_FIELD_ID}
        name={field.name}
        value={field.value}
        placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)}
        ariaLabel={error?.message ? `${label}, ${t(error.message)}` : label}
        hasError={!!error}
        isDisabled={isDisabled}
        isRequired
        onOdsChange={(event) => field.onChange(String(event.detail.value ?? ''))}
        onOdsBlur={field.onBlur}
      >
        {(locations ?? []).map((location) => (
          <option key={location.name} value={location.name}>
            {formatLocationTitle(tOrder, location)}
          </option>
        ))}
      </OdsSelect>
    );
  };

  return (
    <OdsFormField className="block">
      <label htmlFor={VAULT_ORDER_REGION_FIELD_ID} slot="label">
        {label}
        <span aria-hidden="true" className="ml-1 text-[var(--ods-color-critical-500)]">
          *
        </span>
      </label>
      {/* One container across the three branches: a skeleton silently replaced by a select, or by the
          "referential unreadable" message, tells a screen-reader user nothing (WCAG 2.1 SC 4.1.3). */}
      <div id={VAULT_ORDER_REGION_CONTROL_ID} aria-live="polite" aria-busy={isPending}>
        {renderControl()}
      </div>
      <FieldError
        fieldId={VAULT_ORDER_REGION_FIELD_ID}
        message={error?.message && t(error.message)}
      />
    </OdsFormField>
  );
};
