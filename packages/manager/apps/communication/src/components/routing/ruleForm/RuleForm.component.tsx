import { forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';
import type { MouseEvent } from 'react';
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
  Button,
  BUTTON_VARIANT,
  Divider,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  Input,
  Link,
  Text,
  TEXT_PRESET,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Combobox,
  ComboboxContent,
  ComboboxControl,
} from '@ovhcloud/ods-react';
import { useDataApi } from '@ovh-ux/muk';
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
  } = useDataApi<ContactMean>({
    route: '/notification/contactMean',
    version: 'v2',
    iceberg: true,
    cacheKey: getContactMeanListQueryKey(),
    enabled: true,
    fetchAll: true,
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
            <FormField invalid={!!errors.name}>
              <FormFieldLabel htmlFor={name} aria-label={t('rule_form_name_label')}>
                {t('rule_form_name_label')}*
              </FormFieldLabel>
              <Input
                name={name}
                value={value || ''}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
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
            <FormField invalid={!!errors.active}>
              <FormFieldLabel htmlFor={name} aria-label={t('rule_form_active_label')}>
                {t('rule_form_active_label')}{' '}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name="circle-question"
                      id={`${name}-tooltip`}
                      color="primary"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('rule_form_active_label_tooltip')}
                  </TooltipContent>
                </Tooltip>
              </FormFieldLabel>
              <Toggle
                name={name}
                checked={Boolean(value)}
                onBlur={onBlur}
                onCheckedChange={(checked) => {
                  onChange(checked);
                }}
              >
                <ToggleControl />
                <ToggleLabel />
              </Toggle>
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
                variant={BUTTON_VARIANT.default}
                size="sm"
                onClick={() => remove(index)}
              >
                <Icon name="trash" />
                {t('rule_form_rule_delete_button')}
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
                      {errors.rules?.[index]?.condition?.category && (
                        <FormFieldError>
                          {t(
                            errors.rules?.[index]?.condition?.category?.message ||
                              'error_required_field',
                            {
                              ns: NAMESPACES.FORM,
                            },
                          )}
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
                      {errors.rules?.[index]?.condition?.priority && (
                        <FormFieldError>
                          {t(
                            errors.rules?.[index]?.condition?.priority?.message ||
                              'error_required_field',
                            {
                              ns: NAMESPACES.FORM,
                            },
                          )}
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
                        invalid={!!errors.rules?.[index]?.contactMeans}
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
                          {t(
                            errors.rules?.[index]?.contactMeans?.message ||
                              'error_required_field',
                            {
                              ns: NAMESPACES.FORM,
                            },
                          )}
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
                    <FormField className="flex flex-row gap-4 items-center" invalid={!!errors.rules?.[index]?.continue}>
                      <Toggle
                        name={name}
                        checked={Boolean(value)}
                        onBlur={onBlur}
                        onCheckedChange={(checked) => {
                          onChange(checked);
                        }}
                      >
                        <ToggleControl />
                        <ToggleLabel>
                          <Text preset={TEXT_PRESET.span}>
                            {t('rule_form_rule_continue_label')}{' '}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Icon
                                  name="circle-question"
                                  id={`${name}-tooltip`}
                                  color="primary"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
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
                        </ToggleLabel>
                      </Toggle>
                    </FormField>
                  )}
                />
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-row justify-start">
          <FormField invalid={!!errors.rules?.root}>
            <Link
              href=""
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
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
            >
              {t('rule_form_rule_add_button')}
            </Link>
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
