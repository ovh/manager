import {
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
  ToggleProp,
} from '@ovhcloud/ods-react';
import { Badge, BadgeProps } from '@ovh-ux/manager-pci-common';

export const ToggleField = ({
  label,
  badges,
  ...toggleProps
}: {
  label: string;
  badges?: BadgeProps[];
} & ToggleProp) => {
  return (
    <Text preset={'label'}>
      <Toggle {...toggleProps}>
        <ToggleControl />

        <ToggleLabel className="flex">
          <Text>{label}</Text>

          {!!badges && (
            <span className={'ml-4 flex flex-row gap-2 flex-wrap'}>
              {badges.map((badge) => (
                <Badge {...badge} key={badge.label} size={badge.size ?? 'sm'} />
              ))}
            </span>
          )}
        </ToggleLabel>
      </Toggle>
    </Text>
  );
};
