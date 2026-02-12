import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  FormField,
  FormFieldLabel,
  FormFieldError,
} from '@ovhcloud/ods-react';
import {
  TConfigurationRuleField,
  TTranslatedEnum,
  ContactEditFormValues,
} from '@/domain/types/contactEdit';
import {
  FIELD_NAME_LIST,
  FORCED_FIELDS,
  OPERATORS,
  DATE_FORMAT_PLACEHOLDER,
  getFieldLabelKey,
} from '@/domain/constants/contactEdit';
import {
  findMatchingConstraint,
  resolveFormValue,
} from '@/domain/utils/contactEditConstraints';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface EditHolderFormFieldProps {
  readonly rule: TConfigurationRuleField;
  readonly contactInformations: Record<string, unknown>;
  readonly formValues: ContactEditFormValues;
  readonly onFieldChange: (fieldLabel: string, value: unknown) => void;
}

const SPECIAL_LABELS = new Set([
  FIELD_NAME_LIST.legalform,
  FIELD_NAME_LIST.legalFormCategory,
  FIELD_NAME_LIST.organisationType,
  FIELD_NAME_LIST.registrantDocumentType,
]);

const COUNTRY_LABELS = new Set([
  FIELD_NAME_LIST.addressCountry,
  FIELD_NAME_LIST.nationality,
]);

export default function EditHolderFormField({
  rule,
  contactInformations,
  formValues,
  onFieldChange,
}: EditHolderFormFieldProps) {
  const { t } = useTranslation(['domain', NAMESPACES.COUNTRIES, NAMESPACES.LANGUAGE]);
  const [touched, setTouched] = useState(false);

  const isRequired = useMemo((): boolean => {
    return (
      Object.values(FORCED_FIELDS).includes(rule?.label) ||
      !!findMatchingConstraint(
        rule?.constraints ?? [],
        OPERATORS.REQUIRED,
        formValues,
        contactInformations,
        rule.label,
      )
    );
  }, [rule, formValues, contactInformations]);

  // Evaluate readonly against the *saved* contact data, not the current form values.
  // This prevents a field from locking itself when the user changes its value
  // (e.g. changing nationality to FI on a .fi domain would immediately make the field readonly).
  const isReadOnly = useMemo((): boolean => {
    return (
      isRequired &&
      !!findMatchingConstraint(
        rule?.constraints ?? [],
        OPERATORS.READONLY,
        {},
        contactInformations,
        rule.label,
      )
    );
  }, [rule, contactInformations, isRequired]);

  const enumList = useMemo((): string[] => {
    return (
      findMatchingConstraint(
        rule?.constraints ?? [],
        OPERATORS.CONTAINS,
        formValues,
        contactInformations,
        rule.label,
      )?.values || []
    );
  }, [rule, formValues, contactInformations]);

  const fieldType = useMemo((): 'text' | 'select' | 'date' => {
    if (enumList.length > 0) {
      return 'select';
    }
    if (rule.label === FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    return 'text';
  }, [rule, enumList]);

  const fieldSubType = useMemo(
    (): 'text' | 'email' | 'number' | 'search' | 'time' | 'password' | 'url' => {
      if ([FIELD_NAME_LIST.email].includes(rule.label)) {
        return 'email';
      }
      return 'text';
    },
    [rule],
  );

  const getEnumTranslationKey = (label: string, value: string): string => {
    if (SPECIAL_LABELS.has(label)) {
      return `domain_tab_CONTACT_edit_form_enum_${label}_${value}`.replaceAll('.', '_');
    }

    if (label === FIELD_NAME_LIST.language) {
      return `${NAMESPACES.LANGUAGE}:${label}_${value}`;
    }

    if (COUNTRY_LABELS.has(label)) {
      return `${NAMESPACES.COUNTRIES}:${label}_${value}`
        .replaceAll('.', '_')
        .replace(/address_country|nationality/, 'country');
    }

    return `${label}_${value}`;
  };

  const translatedEnums: TTranslatedEnum[] = useMemo(() => {
    return enumList
      .map((value) => ({
        key: value,
        translated: t(getEnumTranslationKey(rule.label, value)),
      }))
      .sort((a, b) => a.translated.localeCompare(b.translated));
  }, [enumList, rule.label]);

  const labelTranslation = useMemo(() => {
    const readOnly = isReadOnly && isRequired;
    const translatedLabel = t(
      getFieldLabelKey(rule.label),
    );
    return [translatedLabel, ...(readOnly ? ['*'] : [])].join(' ');
  }, [rule.label, isReadOnly, isRequired]);


  // Get current value from formValues
  const currentValue = formValues[rule.label];

  // Validation
  const validationError = useMemo((): string | null => {
    if (!touched) return null;
    if (isRequired && !currentValue) {
      return t('domain_tab_CONTACT_edit_form_required_error');
    }
    return null;
  }, [touched, isRequired, currentValue]);

  const selectItems: SelectItem[] = useMemo(
    () =>
      translatedEnums.map((item) => ({
        label: item.translated,
        value: item.key,
      })),
    [translatedEnums],
  );

  const selectValue = useMemo((): string[] => {
    const resolved = resolveFormValue(currentValue);
    return resolved ? [resolved] : [];
  }, [currentValue]);

  if (!isRequired) {
    return null;
  }

  return (
    <FormField className="mb-4" invalid={!!validationError}>
      <FormFieldLabel htmlFor={`ovh_field_${rule.label}`}>
        {labelTranslation}
      </FormFieldLabel>

      {fieldType === 'text' && (
        <Input
          id={`ovh_field_${rule.label}`}
          name={`ovh_field_${rule.label}`}
          type={fieldSubType}
          value={(currentValue as string) ?? ''}
          onChange={(e) => onFieldChange(rule.label, e.target.value)}
          onBlur={() => setTouched(true)}
          disabled={isReadOnly}
          readOnly={isReadOnly}
          placeholder={rule.placeholder}
          invalid={!!validationError}
        />
      )}

      {fieldType === 'select' && (
        <Select
          id={`ovh_field_${rule.label}`}
          items={selectItems}
          value={selectValue}
          onValueChange={({ value }) => {
            const selectedKey = value[0];
            const selected = translatedEnums.find(
              (item) => item.key === selectedKey,
            );
            onFieldChange(rule.label, selected || selectedKey);
            setTouched(true);
          }}
          disabled={isReadOnly}
        >
          <SelectControl />
          <SelectContent />
        </Select>
      )}

      {fieldType === 'date' && (
        <Input
          id={`ovh_field_${rule.label}`}
          name={`ovh_field_${rule.label}`}
          type="text"
          value={(currentValue as string) ?? ''}
          onChange={(e) => onFieldChange(rule.label, e.target.value)}
          onBlur={() => setTouched(true)}
          disabled={isReadOnly}
          readOnly={isReadOnly}
          placeholder={DATE_FORMAT_PLACEHOLDER}
          invalid={!!validationError}
        />
      )}

      {validationError && (
        <FormFieldError>
          {validationError}
        </FormFieldError>
      )}
    </FormField>
  );
}
