import { forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsToggle,
  OdsText,
  OdsDivider,
  OdsLink,
  OdsIcon,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  OdsToggleChangeEventDetail,
  OdsToggleCustomEvent,
} from '@ovhcloud/ods-components';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { Combobox, ComboboxContent, ComboboxControl } from '@ovh-ux/muk';
import {
  NotificationRouting,
  CreateRouting,
  CreateRoutingSchema,
} from '@/data/types/routing.type';
import { ContactMean, ContactMeanStatus } from '@/data/types/contact-mean.type';
import { useNotificationReference } from '@/data';
import { getContactMeanListQueryKey } from '@/data/api/contacts';

type RuleFormProps = {
  rule?: NotificationRouting;
  onSubmit: SubmitHandler<CreateRouting>;
};

const RuleForm = forwardRef(({ rule, onSubmit }: RuleFormProps, ref) => {
  const { t } = useTranslation([
    'settings',
    'common',
    NAMESPACES.FORM,
    NAMESPACES.DASHBOARD,
  ]);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<CreateRouting>({
    resolver: zodResolver(CreateRoutingSchema),
    defaultValues: rule || {
      active: true,
      name: '',
      rules: [
        {
          condition: {
            category: [],
            priority: [],
          },
          contactMeans: [],
          continue: false,
        },
      ],
    },
  });

  const {
    data: reference,
    isLoading: isLoadingReference,
  } = useNotificationReference();
  const {
    flattenData: contactMeans,
    isLoading: isLoadingContactMeans,
  } = useResourcesIcebergV2<ContactMean>({
    route: '/notification/contactMean',
    shouldFetchAll: true,
    queryKey: getContactMeanListQueryKey(),
    enabled: true,
  });

  const validContactMeans = useMemo(() => {
    if (!Array.isArray(contactMeans)) return [];
    return contactMeans
      .filter((contactMean) => contactMean.status === ContactMeanStatus.VALID)
      .map((contactMean) => ({
        label: contactMean.email || '',
        value: contactMean.id,
      }));
  }, [contactMeans]);

  const categoryItems = useMemo(() => {
    if (!Array.isArray(reference?.categories)) return [];
    return reference?.categories.map((category) => ({
      label: t(`category_${category.name.toLowerCase()}`, { ns: 'common' }),
      value: category.name,
    }));
  }, [reference]);

  const priorityItems = useMemo(() => {
    if (!Array.isArray(reference?.priorities)) return [];
    return reference?.priorities.map((priority) => ({
      label: t(`priority_${priority.name.toLowerCase()}`, { ns: 'common' }),
      value: priority.name,
    }));
  }, [reference]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  // Avoid having a desync between the UI and the form state
  useEffect(() => {
    if (fields.length > 0) {
      const lastIndex = fields.length - 1;
      setValue(`rules.${lastIndex}.continue`, false);
    }
  }, [fields.length, setValue]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField
              error={
                errors.name &&
                t(errors.name.message || 'error_required_field', {
                  ns: NAMESPACES.FORM,
                })
              }
            >
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('rule_form_name_label')}
              >
                {t('rule_form_name_label')}*
              </label>
              <OdsInput
                name={name}
                value={value}
                onBlur={onBlur}
                onOdsChange={onChange}
                hasError={!!errors.name}
                placeholder={t('rule_form_name_placeholder')}
                isRequired
              />
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="active"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField>
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('rule_form_active_label')}
              >
                {t('rule_form_active_label')}{' '}
                <OdsIcon
                  name="circle-question"
                  id={`${name}-tooltip`}
                  color="primary"
                />
                <OdsTooltip triggerId={`${name}-tooltip`}>
                  {t('rule_form_active_label_tooltip')}
                </OdsTooltip>
              </label>
              <OdsToggle
                name={name}
                value={Boolean(value)}
                onBlur={onBlur}
                onOdsChange={(
                  e: OdsToggleCustomEvent<OdsToggleChangeEventDetail>,
                ) => {
                  onChange(!!e.detail.value);
                }}
                withLabel
                hasError={!!errors.active}
              />
            </OdsFormField>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 items-center">
        {fields.map((field, index) => (
          <div key={field.id}>
            <OdsDivider />
            <div className="flex flex-row justify-between gap-4 items-center mt-4">
              <OdsText preset={ODS_TEXT_PRESET.heading5}>
                {t('rule_form_condition_label')}
              </OdsText>
              <OdsButton
                icon="trash"
                variant={ODS_BUTTON_VARIANT.default}
                label=""
                size="sm"
                onClick={() => remove(index)}
              >
                {t('rule_form_rule_delete_button')}
              </OdsButton>
            </div>

            <div className="flex-grow flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name={`rules.${index}.condition.category`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <OdsFormField
                      error={
                        errors.rules?.[index]?.condition?.priority &&
                        t(
                          errors.rules?.[index]?.condition?.priority?.message ||
                            'error_required_field',
                          {
                            ns: NAMESPACES.FORM,
                          },
                        )
                      }
                    >
                      <label
                        htmlFor={name}
                        slot="label"
                        aria-label={t('rule_form_condition_category_label')}
                      >
                        {t('rule_form_condition_category_label')}
                      </label>
                      <Combobox
                        name={name}
                        items={categoryItems}
                        multiple
                        onValueChange={(e: { value: string[] }) =>
                          onChange(e.value)
                        }
                        onBlur={onBlur}
                        invalid={!!errors.rules?.[index]?.condition?.category}
                        noResultLabel={t('no_result_found', {
                          ns: NAMESPACES.DASHBOARD,
                        })}
                        allowCustomValue={false}
                        value={value}
                      >
                        <ComboboxControl loading={isLoadingReference} />
                        <ComboboxContent />
                      </Combobox>
                    </OdsFormField>
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.condition.priority`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <OdsFormField
                      error={
                        errors.rules?.[index]?.condition?.priority &&
                        t(
                          errors.rules?.[index]?.condition?.priority?.message ||
                            'error_required_field',
                          {
                            ns: NAMESPACES.FORM,
                          },
                        )
                      }
                    >
                      <label
                        htmlFor={name}
                        slot="label"
                        aria-label={t('rule_form_condition_priority_label')}
                      >
                        {t('rule_form_condition_priority_label')}
                      </label>
                      <Combobox
                        name={name}
                        items={priorityItems}
                        multiple
                        onValueChange={(e: { value: string[] }) =>
                          onChange(e.value)
                        }
                        onBlur={onBlur}
                        invalid={!!errors.rules?.[index]?.condition?.priority}
                        noResultLabel={t('no_result_found', {
                          ns: NAMESPACES.DASHBOARD,
                        })}
                        allowCustomValue={false}
                        value={value}
                      >
                        <ComboboxControl loading={isLoadingReference} />
                        <ComboboxContent />
                      </Combobox>
                    </OdsFormField>
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.contactMeans`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <OdsFormField
                      error={
                        errors.rules?.[index]?.contactMeans &&
                        t(
                          errors.rules?.[index]?.contactMeans?.message ||
                            'error_required_field',
                          {
                            ns: NAMESPACES.FORM,
                          },
                        )
                      }
                    >
                      <label
                        htmlFor={name}
                        slot="label"
                        aria-label={t(
                          'rule_form_condition_contact_means_label',
                        )}
                      >
                        {t('rule_form_condition_contact_means_label')}*
                      </label>

                      <Combobox
                        name={name}
                        items={validContactMeans}
                        key={`contact-means-${index}-${validContactMeans.length}`}
                        multiple
                        onValueChange={(e: { value: string[] }) =>
                          onChange(e.value.map((id) => ({ id })))
                        }
                        onBlur={onBlur}
                        invalid={!!errors.rules?.[index]?.condition?.priority}
                        noResultLabel={t('no_result_found', {
                          ns: NAMESPACES.DASHBOARD,
                        })}
                        allowCustomValue={false}
                        value={
                          value?.map((contactMean) => contactMean.id) || []
                        }
                      >
                        <ComboboxControl loading={isLoadingContactMeans} />
                        <ComboboxContent />
                      </Combobox>
                    </OdsFormField>
                  )}
                />
              </div>
              {index === fields.length - 1 ? (
                <>
                  {/** Last rule, so we need to hide the continue toggle and force the value to false */}
                  <input
                    type="hidden"
                    {...register(`rules.${index}.continue`)}
                    value="false"
                  />
                </>
              ) : (
                <Controller
                  control={control}
                  name={`rules.${index}.continue`}
                  render={({ field: { onChange, value, onBlur, name } }) => (
                    <OdsFormField className="flex flex-row gap-4 items-center">
                      <OdsToggle
                        name={name}
                        withLabel
                        value={Boolean(value)}
                        onBlur={onBlur}
                        onOdsChange={(
                          e: OdsToggleCustomEvent<OdsToggleChangeEventDetail>,
                        ) => {
                          onChange(!!e.detail.value);
                        }}
                        hasError={!!errors.rules?.[index]?.continue}
                      />
                      <label
                        htmlFor={name}
                        aria-label={t('rule_form_rule_continue_label')}
                      >
                        <OdsText preset="span">
                          {t('rule_form_rule_continue_label')}{' '}
                          <OdsIcon
                            name="circle-question"
                            id={`${name}-tooltip`}
                            color="primary"
                          />
                          <OdsTooltip triggerId={`${name}-tooltip`}>
                            <Trans
                              i18nKey="rule_form_rule_continue_tooltip"
                              t={t}
                              components={{
                                br: <br />,
                              }}
                            />
                          </OdsTooltip>
                        </OdsText>
                      </label>
                    </OdsFormField>
                  )}
                />
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-row justify-start">
          <OdsFormField
            error={errors.rules?.root && t('rule_form_rules_error_message')}
          >
            <OdsLink
              href=""
              label={t('rule_form_rule_add_button')}
              onClick={(e) => {
                e.preventDefault();
                append({
                  condition: {
                    category: [],
                    priority: [],
                  },
                  contactMeans: [],
                  continue: false,
                });
                return false;
              }}
            ></OdsLink>
          </OdsFormField>
        </div>
      </div>
    </form>
  );
});

export default RuleForm;
