import { BUTTON_VARIANT, Button, INPUT_TYPE, Input, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

type PathFieldProps = {
  label: string;
  helpText: string;
  field: {
    value: string | undefined;
    onChange: (value: string) => void;
  };
  disabled?: boolean;
};

export const PathField: React.FC<PathFieldProps> = ({
  label,
  helpText,
  field,
  disabled,
}: PathFieldProps) => (
  <div className="flex flex-col">
    <Text>{label}</Text>

    <div className="flex w-1/3 items-center space-x-2">
      <Button size="sm" variant={BUTTON_VARIANT.outline} disabled={true}>
        {'./'}
      </Button>
      <Input
        type={INPUT_TYPE.text}
        className="w-full"
        name="website-path"
        value={field.value ?? ''}
        onChange={(e) => field.onChange(String(e.target.value))}
        disabled={disabled}
      />
    </div>

    <Text preset={TEXT_PRESET.caption}>{helpText}</Text>
  </div>
);
