import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  Message,
  MessageBody,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CountriesEnum, CreateAttestationBodyParamsType, LanguagesEnum } from '@/data/api/mca/type';
import { zForm } from '@/utils/FormSchemas.utils';

// eslint-disable-next-line max-lines-per-function
const McaStep1 = ({
  country,
  email,
  firstname,
  language,
  name,
  organisation,
  phone,
  isSubmitting,
  handleSaveClick,
}: {
  country: keyof typeof CountriesEnum;
  email: string;
  firstname: string;
  language: keyof typeof LanguagesEnum;
  name: string;
  organisation: string;
  phone: string;
  isSubmitting: boolean;
  handleSaveClick: SubmitHandler<CreateAttestationBodyParamsType>;
}) => {
  const { t } = useTranslation([
    'dashboard/microsoft-customer-agreement',
    NAMESPACES.FORM,
    NAMESPACES.COUNTRIES,
    NAMESPACES.LANGUAGE,
  ]);
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      companyName: organisation,
      country,
      emailAddress: email,
      language,
      phoneNumber: phone,
      signatoryFirstName: firstname,
      signatoryLastName: name,
    },
    mode: 'onChange',
    resolver: zodResolver(zForm(t).AGREEMENT_FORM_SCHEMA),
  });

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{t('signatory_informations')}</Text>
      <Text preset={TEXT_PRESET.paragraph}>{t('signatory_informations_description')}</Text>
      <form
        className="mt-4 w-full space-y-4 md:w-3/4"
        onSubmit={(e) => void handleSubmit(handleSaveClick)(e)}
      >
        <div className="flex w-full md:w-1/2">
          <FormField className="w-full md:pr-6">
            <FormFieldLabel>
              {t(`${NAMESPACES.FORM}:country`)} - {t(`${NAMESPACES.FORM}:required`)}
            </FormFieldLabel>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, name } }) => (
                <Select
                  data-testid={name}
                  name={name}
                  defaultValue={country}
                  aria-label={t(`${NAMESPACES.FORM}:country`)}
                  onValueChange={(event) => onChange(event.value[0])}
                  items={Object.values(CountriesEnum)
                    .map((country) => ({
                      label: t(`${NAMESPACES.COUNTRIES}:country_${country}`),
                      value: country,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label))}
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select`)} />
                  <SelectContent />
                </Select>
              )}
            />
          </FormField>
        </div>
        <div className="flex">
          <Controller
            control={control}
            name="companyName"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField invalid={!!errors?.companyName?.message} className="w-full pr-6 md:w-1/2">
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:companyName`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid={name}
                  invalid={!!errors.companyName}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.companyName?.message}</FormFieldError>
              </FormField>
            )}
          />
          <FormField className="w-full pl-6 md:w-1/2 ">
            <FormFieldLabel>
              {t(`${NAMESPACES.FORM}:language`)} - {t(`${NAMESPACES.FORM}:required`)}
            </FormFieldLabel>
            <Controller
              name="language"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, name } }) => (
                <Select
                  data-testid={name}
                  name={name}
                  defaultValue={language}
                  aria-label={t(`${NAMESPACES.FORM}:language`)}
                  onValueChange={(event) => onChange(event.value[0])}
                  items={Object.values(LanguagesEnum)
                    .map((language) => ({
                      label: t(`${NAMESPACES.LANGUAGE}:language_${language}`),
                      value: language,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label))}
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select`)} />
                  <SelectContent />
                </Select>
              )}
            />
          </FormField>
        </div>
        <div className="flex">
          <Controller
            control={control}
            name="signatoryFirstName"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField
                invalid={!!errors?.signatoryFirstName?.message}
                className="w-full pr-6 md:w-1/2"
              >
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:firstname`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid={name}
                  invalid={!!errors.signatoryFirstName}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.signatoryFirstName?.message}</FormFieldError>
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="signatoryLastName"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField
                invalid={!!errors?.signatoryLastName?.message}
                className="w-full pl-6 md:w-1/2"
              >
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:lastname`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid={name}
                  invalid={!!errors.signatoryLastName}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.signatoryLastName?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
        <div className="flex">
          <Controller
            control={control}
            name="emailAddress"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField invalid={!!errors?.emailAddress?.message} className="w-full pr-6 md:w-1/2">
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:email`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid={name}
                  invalid={!!errors.emailAddress}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.emailAddress?.message}</FormFieldError>
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField invalid={!!errors?.phoneNumber?.message} className="w-full pl-6 md:w-1/2">
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:phone`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid={name}
                  invalid={!!errors.phoneNumber}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.phoneNumber?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
        <div>
          <Message className="mt-5" dismissible={false}>
            <MessageIcon name={ICON_NAME.circleInfo} />
            <MessageBody>{t('signatory_informations_message')}</MessageBody>
          </Message>
        </div>
        <div>
          <Button
            className="mt-5"
            aria-label={t(`${NAMESPACES.ACTIONS}:confirm`)}
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
          >
            {t(`${NAMESPACES.ACTIONS}:confirm`)}
          </Button>
        </div>
      </form>
    </>
  );
};

export default McaStep1;
