import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Text, Toggle, ToggleLabel } from '@ovhcloud/ods-react';
import { Badge, BadgeProps } from '@ovh-ux/manager-pci-common';

/**
 * Extract boolean properties as a list
 */
type BooleanOrObjectKeys<T extends Record<string, unknown>> = {
  [K in keyof T]-?: T[K] extends Record<string, unknown>
    ? K
    : T[K] extends boolean
    ? K
    : never;
}[keyof T];

/**
 * For each boolean property
 */
type BooleanPropsOnly<T extends Record<string, unknown>> = {
  [K in BooleanOrObjectKeys<T>]-?: T[K] extends Record<string, unknown>
    ? BooleanPropsOnly<T[K]>
    : T[K];
};

export const ToggleField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<BooleanPropsOnly<TFieldValues>> = FieldPath<
    BooleanPropsOnly<TFieldValues>
  >
>({
  label,
  name,
  badges,
}: {
  label: string;
  name: TName;
  badges?: BadgeProps[];
}) => {
  return (
    <div>
      <Controller<BooleanPropsOnly<TFieldValues>, TName>
        render={({ field: { value: fieldValue, onChange, onBlur } }) => {
          // We cast it as unknown to make typescript happy because it cannot get the correct type
          const value = fieldValue as unknown;
          if (
            value === undefined ||
            value === null ||
            typeof value === 'boolean'
          ) {
            const boolValue = value;
            return (
              <Text preset={'label'}>
                <Toggle
                  checked={boolValue ?? false}
                  onClick={() => onChange(!boolValue)}
                  onBlur={onBlur}
                >
                  <ToggleLabel>
                    <span>{label}</span>

                    {!!badges && (
                      <span className={'ml-4 flex flex-row gap-2 flex-wrap'}>
                        {badges.map((badge) => (
                          <Badge
                            {...badge}
                            key={badge.label}
                            size={badge.size ?? 'sm'}
                          />
                        ))}
                      </span>
                    )}
                  </ToggleLabel>
                </Toggle>
              </Text>
            );
          }
          return <></>;
        }}
        name={name}
      />
    </div>
  );
};
