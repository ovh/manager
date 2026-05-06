import React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  Password,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { GeneratePasswordButton } from '@/components';
import { SlotWithService } from '@/data/hooks';
import { AddEmailAccountsSchema, capitalize } from '@/utils';

export const InlineEmailAccountFormItem = ({
  index,
  onRemove,
  availableSlots,
  isLoadingSlots,
}: {
  index: number;
  onRemove: () => void;
  availableSlots: SlotWithService[];
  isLoadingSlots?: boolean;
}) => {
  const { t } = useTranslation(['accounts/form', 'common', NAMESPACES.FORM]);
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<AddEmailAccountsSchema>();

  const domain = watch(`accounts.${index}.domain`);

  const offerCounts = availableSlots.reduce<Record<string, number>>((acc, slot) => {
    acc[slot.offer] = (acc[slot.offer] ?? 0) + 1;
    return acc;
  }, {});
  const slotItems = Object.entries(offerCounts).map(([offer, count]) => ({
    value: offer,
    label: `${capitalize(offer.toLowerCase())} (${count})`,
  }));

  return (
    <div key={`account-${index}`} className="flex flex-col gap-4 border-b border-gray-200 pb-4">
      {/* Row 1 — email + remove button */}
      <div className="flex items-end gap-3">
        <Controller
          control={control}
          name={`accounts.${index}.account`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.account}
            >
              <FormFieldLabel>{t('common:email_account')} *</FormFieldLabel>
              <div className="flex">
                <Input
                  type={INPUT_TYPE.text}
                  placeholder={t('common:account_name')}
                  data-testid="input-account"
                  className="flex-1"
                  id={name}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.account}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
                <Input
                  type={INPUT_TYPE.text}
                  name="@"
                  value={`@${domain}`}
                  readOnly
                  disabled
                  className="shrink-0"
                />
              </div>
              {(isDirty || isTouched) && errors.accounts?.[index]?.account?.message && (
                <FormFieldError>{errors.accounts[index].account.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Button
          id={`delete-account-${index}`}
          data-testid={`delete-account-${index}`}
          type="button"
          onClick={onRemove}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.ghost}
          color={BUTTON_COLOR.critical}
        >
          <Icon name={ICON_NAME.trash} />
        </Button>
      </div>

      {/* Row 2 — first name + last name */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        <Controller
          control={control}
          name={`accounts.${index}.firstName`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="md:flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.firstName}
            >
              <FormFieldLabel>{t('zimbra_account_add_input_firstName_label')} *</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_firstName_placeholder')}
                name={name}
                invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.firstName}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors.accounts?.[index]?.firstName?.message && (
                <FormFieldError>{errors.accounts[index].firstName.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.lastName`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="md:flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.lastName}
            >
              <FormFieldLabel>{t('zimbra_account_add_input_lastName_label')} *</FormFieldLabel>
              <Input
                placeholder={t('zimbra_account_add_input_lastName_placeholder')}
                type={INPUT_TYPE.text}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.lastName}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors.accounts?.[index]?.lastName?.message && (
                <FormFieldError>{errors.accounts[index].lastName.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </div>

      {/* Row 3 — password + generate password */}
      <Controller
        control={control}
        name={`accounts.${index}.password`}
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.password}>
            <FormFieldLabel>{t('zimbra_account_add_input_password_label')} *</FormFieldLabel>
            <div className="flex flex-1 gap-3">
              <Password
                data-testid="input-password"
                className="w-full"
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.password}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              <GeneratePasswordButton
                id={`generate-password-btn-${index}`}
                onGenerate={(password) => {
                  setValue(`accounts.${index}.password`, password, { shouldValidate: true });
                }}
              />
            </div>
            {(isDirty || isTouched) && errors.accounts?.[index]?.password?.message && (
              <FormFieldError>{errors.accounts[index].password.message}</FormFieldError>
            )}
          </FormField>
        )}
      />

      {/* Row 4 — offer / slot */}
      <Controller
        control={control}
        name={`accounts.${index}.offer`}
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField
            className="md:w-1/2"
            invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.offer}
          >
            <FormFieldLabel>{t('common:offer')} *</FormFieldLabel>
            <Select
              items={slotItems}
              id={name}
              name={name}
              disabled={isLoadingSlots}
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.offer}
              value={value ? [value] : []}
              onValueChange={(detail) => {
                const pickedOffer = detail.value?.[0];
                if (!pickedOffer) return;
                onChange(pickedOffer);
                // resolve a free slot id of the chosen offer for this row
                const slot = availableSlots.find((s) => s.offer === pickedOffer);
                if (slot) {
                  setValue(`accounts.${index}.slotId`, slot.id, { shouldValidate: true });
                }
              }}
              onBlur={onBlur}
              data-testid={`select-slot-${index}`}
            >
              <SelectControl placeholder={t('common:select_slot')} />
              <SelectContent />
            </Select>
            {(isDirty || isTouched) && errors.accounts?.[index]?.offer?.message && (
              <FormFieldError>{errors.accounts[index].offer.message}</FormFieldError>
            )}
          </FormField>
        )}
      />
    </div>
  );
};

export default InlineEmailAccountFormItem;
