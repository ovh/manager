import { ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

export type PasswordHintRule = {
  label: string;
  valid: boolean;
};

interface PasswordHintProps {
  rules: PasswordHintRule[];
}

export const PasswordHint: React.FC<PasswordHintProps> = ({ rules }: PasswordHintProps) => (
  <ul className="mt-1 flex list-none flex-col items-start pl-0">
    {rules.map((rule) => (
      <li key={rule.label} className="flex items-center gap-2">
        <Icon
          name={rule.valid ? ICON_NAME.check : ICON_NAME.xmark}
          className={
            rule.valid
              ? 'text-[var(--ods-color-success-500)]'
              : 'text-[var(--ods-color-critical-500)]'
          }
        />
        <Text preset={TEXT_PRESET.caption}>{rule.label}</Text>
      </li>
    ))}
  </ul>
);
