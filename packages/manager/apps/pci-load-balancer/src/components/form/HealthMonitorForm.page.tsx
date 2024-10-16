import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QuantitySelector } from '@ovh-ux/manager-pci-common';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  THealthMonitorFormState,
  THealthMonitorType,
} from '@/api/data/health-monitor';
import { TLoadBalancerPool } from '@/api/data/pool';
import LabelComponent from '@/components/form/Label.component';
import {
  BOUNDS,
  EXPECTED_STATUS_CODE_REGEX,
  HEALTH_MONITOR_NAME_REGEX,
  HORIZON_LINK,
  LABELS,
  POOL_HEALTH_MONITOR_TYPE,
} from '@/constants';
import { isTypeHttpOrHttps } from '@/helpers';

type THealthMonitorFormErrors = {
  name?: string;
  expectedCode?: string;
  urlPath?: string;
};

export type HealthMonitorFormProps = {
  title: string;
  associatedPool: TLoadBalancerPool;
  formState: THealthMonitorFormState;
  isEditing?: boolean;
  isPending: boolean;
  submitLabel: string;
  onChange: (state) => void;
  onSubmit: (state: THealthMonitorFormState) => void;
  onCancel: () => void;
};

export default function HealthMonitorForm({
  title,
  associatedPool,
  formState,
  onChange,
  isEditing = false,
  isPending,
  onCancel,
  onSubmit,
  submitLabel,
}: HealthMonitorFormProps) {
  const { t: tCommon } = useTranslation('pci-common');
  const { t } = useTranslation('health-monitor/form');

  const displayHttpSpecificFields = useMemo(
    () => formState?.type && isTypeHttpOrHttps(formState?.type),
    [formState?.type],
  );

  const healthMonitorTypes = useMemo(
    () => POOL_HEALTH_MONITOR_TYPE[associatedPool?.protocol] || [],
    [associatedPool?.protocol],
  );

  const [errors, setErrors] = useState<THealthMonitorFormErrors>({});

  const [isNameTouched, setIsNameTouched] = useState(false);

  const validateField = (name: keyof THealthMonitorFormState, value) => {
    const newErrors: THealthMonitorFormErrors = { ...errors };

    if (name === 'name' && isNameTouched) {
      if (!value) {
        newErrors.name = tCommon('common_field_error_required');
      } else if (!HEALTH_MONITOR_NAME_REGEX.test(value)) {
        newErrors.name = tCommon('common_field_error_pattern');
      } else {
        delete newErrors.name;
      }
    }

    if (isTypeHttpOrHttps(formState.type)) {
      if (name === 'expectedCode') {
        if (!value) {
          newErrors.expectedCode = tCommon('common_field_error_required');
        } else if (!EXPECTED_STATUS_CODE_REGEX.test(`${value}`)) {
          newErrors.expectedCode = tCommon('common_field_error_pattern');
        } else {
          delete newErrors.expectedCode;
        }
      }

      if (name === 'urlPath') {
        if (!value) {
          newErrors.urlPath = tCommon('common_field_error_required');
        } else {
          delete newErrors.urlPath;
        }
      }
    }

    setErrors(newErrors);
  };

  const isFormValid = Object.keys(errors).length === 0 && formState?.type;

  const handle = {
    change: (key: keyof THealthMonitorFormState, value) => {
      switch (key) {
        case 'delay':
          onChange((actual) => ({
            ...actual,
            delay: value,
            timeout: actual.timeout >= value ? value - 1 : actual.timeout,
          }));
          break;

        case 'type':
          if (isTypeHttpOrHttps(value)) {
            onChange((actual) => ({
              ...actual,
              type: value,
              urlPath: '/',
              expectedCode: 200,
            }));
          } else {
            onChange((actual) => {
              const { urlPath, expectedCode, ...rest } = actual;
              return { ...rest, type: value };
            });
          }
          break;

        default:
          onChange((actual) => ({
            ...actual,
            [key]: value,
          }));
          break;
      }

      validateField(key, value);
    },
    /**
     * Fixes an issue with the `odsInput` component where the `onOdsValueChange` event
     * is triggered during the initial render of the input, although it should not be.
     */
    keyDown: (key: keyof THealthMonitorFormState) => {
      if (key === 'name') setIsNameTouched(true);
    },
  };

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div>
      <section className="my-8">
        <OsdsText
          size={ODS_TEXT_SIZE._600}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {title}
        </OsdsText>
        <OsdsText
          className="block my-6"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_health_monitor_form_description_1')}
        </OsdsText>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_health_monitor_form_description_2')}
        </OsdsText>
        <Links
          className="ml-3"
          href={HORIZON_LINK}
          type={LinkType.next}
          target={OdsHTMLAnchorElementTarget._blank}
          label={t(
            'octavia_load_balancer_health_monitor_form_description_link',
          )}
        />
      </section>

      <div className="min-w-[20rem] md:w-1/4 sm:w-1">
        <OsdsFormField className="my-8">
          <LabelComponent
            text={t('octavia_load_balancer_health_monitor_form_name')}
            hasError={!!errors.name}
          />

          <OsdsInput
            name="name"
            type={ODS_INPUT_TYPE.text}
            value={formState?.name}
            error={!!errors.name}
            onOdsValueChange={(event) =>
              handle.change('name', event.detail.value)
            }
            onKeyDown={() => handle.keyDown('name')}
          />

          <div slot="helper">
            <OsdsText className="block" color={ODS_THEME_COLOR_INTENT.error}>
              {errors.name}
            </OsdsText>
            <OsdsText
              color={
                errors.name
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.text
              }
            >
              {t('octavia_load_balancer_health_monitor_form_name_help')}
            </OsdsText>
          </div>
        </OsdsFormField>

        <OsdsFormField className="my-8">
          <LabelComponent
            text={t('octavia_load_balancer_health_monitor_form_type')}
          />

          <OsdsSelect
            name="type"
            value={formState?.type}
            inline
            onOdsValueChange={(event) =>
              handle.change('type', event.detail.value)
            }
            disabled={isEditing || undefined}
          >
            <span slot="placeholder">
              {t('octavia_load_balancer_health_monitor_form_type_default')}
            </span>
            {healthMonitorTypes.map((type: THealthMonitorType) => (
              <OsdsSelectOption key={type} value={type}>
                {type}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>

        {displayHttpSpecificFields && (
          <div>
            <OsdsFormField className="my-8" error={errors.urlPath}>
              <LabelComponent
                text={LABELS.URL_PATH}
                hasError={!!errors.urlPath}
              />

              <OsdsInput
                name="url-path"
                error={!!errors.urlPath}
                type={ODS_INPUT_TYPE.text}
                value={formState?.urlPath}
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsValueChange={(event) =>
                  handle.change('urlPath', event.detail.value)
                }
              />
            </OsdsFormField>

            <OsdsFormField className="my-8" error={errors.expectedCode}>
              <LabelComponent
                text={t(
                  'octavia_load_balancer_health_monitor_form_expected_code',
                )}
                helpText={t(
                  'octavia_load_balancer_health_monitor_form_expected_code_tooltip',
                )}
                hasError={!!errors.expectedCode}
              />

              <OsdsInput
                name="expected-code"
                type={ODS_INPUT_TYPE.text}
                value={formState?.expectedCode}
                error={!!errors.expectedCode}
                onOdsValueChange={(event) =>
                  handle.change('expectedCode', event.detail.value)
                }
              />

              <div slot="helper">
                <OsdsText
                  className="block"
                  color={ODS_THEME_COLOR_INTENT.error}
                >
                  {errors.expectedCode}
                </OsdsText>
                <OsdsText
                  color={
                    errors.expectedCode
                      ? ODS_THEME_COLOR_INTENT.error
                      : ODS_THEME_COLOR_INTENT.text
                  }
                >
                  {t(
                    'octavia_load_balancer_health_monitor_form_expected_code_help',
                  )}
                </OsdsText>
              </div>
            </OsdsFormField>
          </div>
        )}

        <div>
          <QuantitySelector
            className="w-[100%] my-8"
            contentClassName="flex justify-between items-center"
            label={LABELS.MAX_RETRIES_DOWN}
            value={formState?.maxRetriesDown}
            min={BOUNDS.MAX_RETRIES_DOWN.MIN}
            max={BOUNDS.MAX_RETRIES_DOWN.MAX}
            onValueChange={(value) => handle.change('maxRetriesDown', value)}
            labelHelpText={t(
              'octavia_load_balancer_health_monitor_form_max_retries_down_tooltip',
            )}
          />

          <QuantitySelector
            className="w-[100%] my-8"
            contentClassName="flex justify-between items-center"
            label={LABELS.DELAY}
            value={formState?.delay}
            min={BOUNDS.DELAY.MIN}
            onValueChange={(value) => handle.change('delay', value)}
            labelHelpText={t(
              'octavia_load_balancer_health_monitor_form_delay_tooltip',
            )}
          />

          <QuantitySelector
            className="w-[100%] my-8"
            contentClassName="flex justify-between items-center"
            label={LABELS.MAX_RETRIES}
            labelHelpText={t(
              'octavia_load_balancer_health_monitor_form_max_retries_tooltip',
            )}
            value={formState?.maxRetries}
            min={BOUNDS.MAX_RETRIES.MIN}
            max={BOUNDS.MAX_RETRIES.MAX}
            onValueChange={(value) => handle.change('maxRetries', value)}
          />

          <QuantitySelector
            className="w-[100%] my-8"
            contentClassName="flex justify-between items-center"
            label={LABELS.TIMEOUT}
            labelHelpText={t(
              'octavia_load_balancer_health_monitor_form_timeout_tooltip',
            )}
            value={formState?.timeout}
            min={BOUNDS.TIMEOUT.MIN}
            max={formState?.delay - 1}
            onValueChange={(value) => handle.change('timeout', value)}
          />
        </div>

        <div className="flex gap-4">
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={onCancel}
          >
            {tCommon('common_cancel')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit(formState)}
            disabled={!isFormValid || undefined}
          >
            {submitLabel}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
}
