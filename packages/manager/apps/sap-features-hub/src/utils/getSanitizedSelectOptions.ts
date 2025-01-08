import { SelectOptionsProps } from '@/components/Form/SelectField.component';

type SanitizedSelectOption = {
  value: string;
  label: string;
};

export const getSanitizedSelectOptions = <T>({
  options,
  optionLabelKey,
  optionValueKey,
}: SelectOptionsProps<T>): SanitizedSelectOption[] =>
  options.map((opt) =>
    typeof opt === 'object'
      ? {
          value: String(opt?.[optionValueKey] || ''),
          label: String(opt?.[optionLabelKey] || opt?.[optionValueKey] || ''),
        }
      : { value: String(opt), label: String(opt) },
  );
