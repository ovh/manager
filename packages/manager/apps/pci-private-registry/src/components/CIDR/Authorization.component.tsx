import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FilterRestrictionsEnum } from '@/types';
import { capitalizeAndJoin } from '@/helpers';

const Authorization = () => {
  const { control, formState, trigger } = useFormContext();
  const { t } = useTranslation(['ip-restrictions']);
  return (
    <Controller
      name="authorization"
      control={control}
      render={({ field: { onChange, value }, fieldState: { isDirty } }) => (
        <OsdsSelect
          data-testid="authorization-select"
          error={Boolean(formState.errors?.authorization?.message)}
          onOdsValueChange={(e) => {
            if (typeof e.target.value === 'string') {
              onChange(JSON.parse(e.detail.value as string));
            }
            if (!isDirty) {
              trigger('authorization');
            }
          }}
          value={JSON.stringify(value)}
        >
          <span slot="placeholder" className=" font-normal">
            {t('private_registry_cidr_authorization_select')}
          </span>
          <OsdsSelectOption
            value={JSON.stringify([FilterRestrictionsEnum.REGISTRY])}
          >
            {capitalizeAndJoin([FilterRestrictionsEnum.REGISTRY])}
          </OsdsSelectOption>
          <OsdsSelectOption
            value={JSON.stringify([FilterRestrictionsEnum.MANAGEMENT])}
          >
            {capitalizeAndJoin([FilterRestrictionsEnum.MANAGEMENT])}
          </OsdsSelectOption>
          <OsdsSelectOption
            value={JSON.stringify([
              FilterRestrictionsEnum.MANAGEMENT,
              FilterRestrictionsEnum.REGISTRY,
            ])}
          >
            {capitalizeAndJoin([
              FilterRestrictionsEnum.MANAGEMENT,
              FilterRestrictionsEnum.REGISTRY,
            ])}
          </OsdsSelectOption>
        </OsdsSelect>
      )}
    />
  );
};

export default Authorization;
