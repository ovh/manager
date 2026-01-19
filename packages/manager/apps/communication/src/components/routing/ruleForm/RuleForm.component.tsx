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
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { Button, Combobox, ComboboxContent, ComboboxControl, Divider, FormField, FormFieldError, FormFieldLabel, Icon, Link, Text, TEXT_PRESET, Input, Toggle, ToggleCheckedChangeDetail, Tooltip, TooltipTrigger, TooltipContent } from '@ovhcloud/ods-react';
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
  } = useNotificationReference({
    select: (data) => {
      const categories = data.categories.map((category) => ({
        label: t(`category_${category.name.toLowerCase()}`, { ns: 'common' }),
        value: category.name,
      }));

      const priorities = data.priorities.map((priority) => ({
        label: t(`priority_${priority.name.toLowerCase()}`, { ns: 'common' }),
        value: priority.name,
      }));

      return { categories, priorities };

    }
  });

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
            <FormField invalid={!!errors.name}>
              <FormFieldLabel
                htmlFor={name}
                aria-label={t('rule_form_name_label')}
              >
                {t('rule_form_name_label')}*
              </FormFieldLabel>
              <Input
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                invalid={!!errors.name}
                placeholder={t('rule_form_name_placeholder')}
                required
              />
              {errors.name && (
                <FormFieldError>
                  {t(errors.name.message || 'error_required_field', {
                    ns: NAMESPACES.FORM,
                  })}
                </FormFieldError>
              )}
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="active"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <FormField>
              <FormFieldLabel
                htmlFor={name}
                aria-label={t('rule_form_active_label')}
              >
                {t('rule_form_active_label')}{' '}
                <Tooltip position='bottom-start'>
                  <TooltipTrigger asChild>
                    <Icon
                      name="circle-question"
                      color="primary"
                    />
                  </TooltipTrigger>
                  <TooltipContent withArrow className="max-w-md">
                      {t('rule_form_active_label_tooltip')}
                  </TooltipContent>
                </Tooltip>
              </FormFieldLabel>
              <Toggle
                name={name}
                checked={value}
                onBlur={onBlur}
                onCheckedChange={(
                  detail: ToggleCheckedChangeDetail,
                ) => {
                  onChange(!!detail.checked);
                }}
                withLabels
                invalid={!!errors.active}
              />
            </FormField>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 items-center">
        {fields.map((field, index) => (
          <div key={field.id}>
            <Divider />
            <div className="flex flex-row justify-between gap-4 items-center mt-4">
              <Text preset={TEXT_PRESET.heading5}>
                {t('rule_form_condition_label')}
              </Text>
              <Button
                variant="default"
                size="sm"
                onClick={() => remove(index)}
                aria-label={t('rule_form_rule_delete_button')}
              >
                <Icon name="trash" />
              </Button>
            </div>

            <div className="flex-grow flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name={`rules.${index}.condition.category`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <FormField
                      invalid={!!errors.rules?.[index]?.condition?.category}
                    >
                      <FormFieldLabel
                        htmlFor={name}
                        aria-label={t('rule_form_condition_category_label')}
                      >
                        {t('rule_form_condition_category_label')}
                      </FormFieldLabel>
                      <Combobox
                        name={name}
                        key={`${name}_${reference?.categories.length}`}
                        items={reference?.categories || []}
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
                      {errors.rules?.[index]?.condition?.category && (
                        <FormFieldError>
                          {t(errors.rules?.[index]?.condition?.category?.message || 'error_required_field', {
                            ns: NAMESPACES.FORM,
                          })}
                        </FormFieldError>
                      )}
                    </FormField>
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.condition.priority`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <FormField
                      invalid={!!errors.rules?.[index]?.condition?.priority}
                    >
                      <FormFieldLabel
                        htmlFor={name}
                        aria-label={t('rule_form_condition_priority_label')}
                      >
                        {t('rule_form_condition_priority_label')}
                      </FormFieldLabel>
                      <Combobox
                        name={name}
                        key={`${name}_${reference?.priorities.length}`}
                        items={reference?.priorities || []}
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
                      {errors.rules?.[index]?.condition?.priority && (
                        <FormFieldError>
                          {t(errors.rules?.[index]?.condition?.priority?.message || 'error_required_field', {
                            ns: NAMESPACES.FORM,
                          })}
                        </FormFieldError>
                      )}
                    </FormField>
                  )}
                />
                <Controller
                  control={control}
                  name={`rules.${index}.contactMeans`}
                  render={({ field: { onChange, value, name, onBlur } }) => (
                    <FormField
                      invalid={!!errors.rules?.[index]?.contactMeans}
                    >
                      <FormFieldLabel
                        htmlFor={name}
                        aria-label={t(
                          'rule_form_condition_contact_means_label',
                        )}
                      >
                        {t('rule_form_condition_contact_means_label')}*
                      </FormFieldLabel>

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
                      {errors.rules?.[index]?.contactMeans && (
                        <FormFieldError>
                          {t(errors.rules?.[index]?.contactMeans?.message || 'error_required_field', {
                            ns: NAMESPACES.FORM,
                          })}
                        </FormFieldError>
                      )}
                    </FormField>
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
                    <FormField className="flex flex-row gap-4 items-center">
                      <Toggle
                        name={name}
                        withLabels
                        checked={value}
                        onBlur={onBlur}
                        onCheckedChange={(
                          detail: ToggleCheckedChangeDetail,
                        ) => {
                          onChange(!!detail.checked);
                        }}
                        invalid={!!errors.rules?.[index]?.continue}
                      />
                      <label
                        htmlFor={name}
                        aria-label={t('rule_form_rule_continue_label')}
                      >
                        <Text preset={TEXT_PRESET.span}>
                          {t('rule_form_rule_continue_label')}{' '}
                          <Tooltip position="bottom-start">
                            <TooltipTrigger asChild>
                              <Icon
                                name="circle-question"
                                color="primary"
                              />
                            </TooltipTrigger>
                            <TooltipContent withArrow>
                              <Trans
                                i18nKey="rule_form_rule_continue_tooltip"
                                t={t}
                                components={{
                                  br: <br />,
                                }}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </Text>
                      </label>
                    </FormField>
                  )}
                />
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-row justify-start">
          <FormField
            invalid={!!errors.rules?.root}
          >
            <Link
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
            >{t('rule_form_rule_add_button')}</Link>
            {errors.rules?.root && (
              <FormFieldError>
                {t('rule_form_rules_error_message')}
              </FormFieldError>
            )}
          </FormField>
        </div>
      </div>
    </form>
  );
});

export default RuleForm;
