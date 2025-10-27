import {
  Badge,
  BadgeProp,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
  ToggleProp,
} from '@ovhcloud/ods-react';

type BadgeProps = { label: string } & BadgeProp;

type ToogleFieldProps = {
  label: string;
  badges?: BadgeProps[];
} & ToggleProp;

export const ToggleField = ({
  label,
  badges,
  ...toggleProps
}: ToogleFieldProps) => (
  <Text preset={'label'}>
    <Toggle {...toggleProps}>
      <ToggleControl />

      <ToggleLabel className="flex">
        <Text>{label}</Text>

        {badges && badges.length && (
          <span className={'ml-4 flex flex-row gap-2 flex-wrap'}>
            {badges.map(({ label: badgeLabel, size, ...restBadge }) => (
              <Badge key={badgeLabel} size={size ?? 'sm'} {...restBadge}>
                {badgeLabel}
              </Badge>
            ))}
          </span>
        )}
      </ToggleLabel>
    </Toggle>
  </Text>
);
