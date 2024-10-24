import { useEffect, useMemo, useState } from 'react';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TL7Rule } from '@/api/data/l7Rules';
import {
  COMPARE_TYPES_AVAILABILITY_BY_TYPE,
  KEY_REGEX,
  RULE_COMPARE_TYPES,
  RULE_TYPES,
  RULE_TYPES_LIST,
  RULE_TYPES_WITH_KEY,
  VALUE_REGEX_BY_TYPE,
} from '@/constants';
import LabelComponent from '@/components/form/Label.component';

export type RuleFormProps = {
  rule: TL7Rule | null;
  onSubmit: (rule: TL7Rule) => void;
  submitButtonText?: string;
  onCancel: () => void;
};

export default function RuleForm({
  rule,
  onSubmit,
  submitButtonText,
  onCancel,
}: Readonly<RuleFormProps>) {
  const { t } = useTranslation('l7/rules/rules-form');
  const { t: tPciCommon } = useTranslation('pci-common');
  const [formState, setFormState] = useState<TL7Rule>({
    value: '',
    invert: false,
    key: '',
    ruleType: '',
    compareType: '',
  } as TL7Rule);

  useEffect(() => {
    if (rule) {
      setFormState((state) => ({
        ...state,
        ...rule,
      }));
    }
  }, [rule]);

  const isDisabled =
    !formState.ruleType ||
    !formState.value ||
    !formState.key ||
    !formState.compareType;
  const [isTouched, setIsTouched] = useState({
    ruleType: false,
    compareType: false,
    key: false,
    value: false,
  });

  const keyError = useMemo(() => {
    if (isTouched.key) {
      if (!formState.key) {
        return tPciCommon('common_field_error_required');
      }
      if (!RegExp(KEY_REGEX).test(formState.key)) {
        return t('octavia_load_balancer_create_l7_rule_key_pattern');
      }
    }
    return '';
  }, [isTouched.key, formState.key]);

  const valueErrorMessage = useMemo(() => {
    if (isTouched.value) {
      if (!formState.value) {
        return tPciCommon('common_field_error_required');
      }
      if (formState.compareType === RULE_COMPARE_TYPES.REGEX) {
        return t('octavia_load_balancer_create_l7_rule_value_regex_pattern');
      }
      if (formState.ruleType === RULE_TYPES.SSL_VERIFY_RESULT) {
        return t(
          'octavia_load_balancer_create_l7_rule_value_ssl_verify_result_pattern',
        );
      }
      if (formState.ruleType === RULE_TYPES.COOKIE) {
        return t('octavia_load_balancer_create_l7_rule_value_cookie_pattern');
      }
      return t('octavia_load_balancer_create_l7_rule_value_default_pattern');
    }
    return '';
  }, [
    isTouched.value,
    formState.value,
    formState.ruleType,
    formState.compareType,
  ]);

  const validateValuePattern = useMemo(() => {
    if (formState.compareType === RULE_COMPARE_TYPES.REGEX) {
      try {
        const regex = new RegExp(formState.value);
        return !!regex;
      } catch (e) {
        return false;
      }
    }
    // If there is no regex for the rule type selected, we validate the value
    if (!VALUE_REGEX_BY_TYPE[formState.ruleType]) {
      return true;
    }
    return new RegExp(VALUE_REGEX_BY_TYPE[formState.ruleType]).test(
      formState.value,
    );
  }, [
    isTouched.value,
    formState.value,
    formState.ruleType,
    formState.compareType,
  ]);

  const listCompareType = useMemo(() => {
    if (formState.ruleType) {
      return COMPARE_TYPES_AVAILABILITY_BY_TYPE[formState.ruleType];
    }
    return [];
  }, [formState.ruleType]);

  return (
    <div className="w-[20rem]">
      <OsdsFormField
        error={
          isTouched.ruleType && !formState.ruleType
            ? tPciCommon('common_field_error_required')
            : ''
        }
      >
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_rule_type')}
          hasError={isTouched.ruleType && !formState.ruleType}
        />
        <OsdsSelect
          value={formState.ruleType}
          inline
          error={isTouched.ruleType && !formState.ruleType}
          onOdsBlur={() => {
            setIsTouched((state) => ({
              ...state,
              ruleType: true,
            }));
          }}
          onOdsValueChange={(event) => {
            const ruleType = event.detail.value as string;
            setFormState((state) => ({
              ...state,
              ruleType,
              value: ruleType === RULE_TYPES.SSL_CONN_HAS_CERT ? 'True' : null,
            }));
          }}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_create_l7_rule_type_default')}
          </span>
          {RULE_TYPES_LIST.map((ruleType) => (
            <OsdsSelectOption key={ruleType.value} value={ruleType.value}>
              {ruleType.label}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
        {formState.ruleType && (
          <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.text}>
            {t(
              `octavia_load_balancer_create_l7_rule_type_${formState.ruleType}`,
            )}
          </OsdsText>
        )}
      </OsdsFormField>
      <OsdsFormField
        className="mt-8"
        error={
          isTouched.compareType && !formState.compareType
            ? tPciCommon('common_field_error_required')
            : ''
        }
      >
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_rule_compare_type')}
          hasError={isTouched.ruleType && !formState.ruleType}
        />
        <OsdsSelect
          value={formState.compareType}
          inline
          key={formState.ruleType}
          error={isTouched.compareType && !formState.compareType}
          onOdsBlur={() => {
            setIsTouched((state) => ({
              ...state,
              compareType: true,
            }));
          }}
          onOdsValueChange={(event) => {
            setFormState((state) => ({
              ...state,
              compareType: event.detail.value as string,
            }));
          }}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_create_l7_rule_compare_type_default')}
          </span>
          {listCompareType?.map((compareType) => (
            <OsdsSelectOption key={compareType.value} value={compareType.value}>
              {compareType.label}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
        {formState.compareType && (
          <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.text}>
            {t(
              `octavia_load_balancer_create_l7_rule_compare_type_${formState.compareType}`,
            )}
          </OsdsText>
        )}
      </OsdsFormField>
      <OsdsFormField className="mt-8" error={keyError}>
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_rule_key')}
          helpText={t('octavia_load_balancer_create_l7_rule_key_tooltip')}
          hasError={
            isTouched.key &&
            (!formState.key || !RegExp(KEY_REGEX).test(formState.key))
          }
        />
        <OsdsInput
          value={formState?.key}
          disabled={
            !RULE_TYPES_WITH_KEY.includes(formState.ruleType) || undefined
          }
          type={ODS_INPUT_TYPE.text}
          error={
            isTouched.key &&
            (!formState.key || !RegExp(KEY_REGEX).test(formState.key))
          }
          onOdsValueChange={(event) => {
            setFormState((state) => ({
              ...state,
              key: event.detail.value,
            }));
          }}
          onOdsInputBlur={() => {
            setIsTouched((state) => ({
              ...state,
              key: true,
            }));
          }}
        />
      </OsdsFormField>
      <OsdsFormField
        className="mt-8"
        error={
          isTouched.value && !validateValuePattern ? valueErrorMessage : ''
        }
      >
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_rule_value')}
          helpText={t('octavia_load_balancer_create_l7_rule_value_tooltip')}
          hasError={isTouched.value && !validateValuePattern}
        />
        <OsdsInput
          value={formState?.value}
          disabled={
            formState.ruleType === RULE_TYPES.SSL_CONN_HAS_CERT || undefined
          }
          type={ODS_INPUT_TYPE.text}
          error={isTouched.value && !validateValuePattern}
          onOdsValueChange={(event) => {
            setFormState((state) => ({
              ...state,
              value: event.detail.value,
            }));
          }}
          onOdsInputBlur={() => {
            setIsTouched((state) => ({
              ...state,
              value: true,
            }));
          }}
        />
      </OsdsFormField>
      <OsdsToggle
        checked={formState.invert || undefined}
        className="mt-8"
        onClick={() => {
          setFormState((state) => ({
            ...state,
            invert: !state.invert,
          }));
        }}
      >
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_rule_invert')}
          helpText={t('octavia_load_balancer_create_l7_rule_invert_tooltip')}
          className="mr-6"
          slot="start"
        />
      </OsdsToggle>
      <div className="flex mt-8">
        <OsdsButton
          className="mr-4"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          onClick={onCancel}
        >
          {t('octavia_load_balancer_create_l7_rule_cancel')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={isDisabled || undefined}
          onClick={() => onSubmit(formState)}
          data-testid="ruleForm-submit_button"
        >
          {submitButtonText || t('octavia_load_balancer_create_l7_rule_submit')}
        </OsdsButton>
      </div>
    </div>
  );
}
