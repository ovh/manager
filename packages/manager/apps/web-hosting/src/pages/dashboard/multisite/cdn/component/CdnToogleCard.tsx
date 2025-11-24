import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleCheckedChangeDetail,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface ToggleCardProps {
  title: string;
  info: string;
  name?: string;
  toggleValue?: boolean;
  disabled?: boolean;
  onToggle?: (event: ToggleCheckedChangeDetail) => void;
  children?: React.ReactNode;
}

// Toggle web component seems to have an issue where the new value is not always detected
// As a temporary solution, the value is kept in sync with an internal state, like in sap-features-hub.
// TODO: ODS migration
export const ToggleCard: React.FC<ToggleCardProps> = ({
  name,
  title,
  info,
  toggleValue,
  disabled = false,
  onToggle,
  children,
}) => {
  const { t } = useTranslation([NAMESPACES.SERVICE]);
  const [internalChecked, setInternalChecked] = useState(!!toggleValue);

  useEffect(() => {
    setInternalChecked(!!toggleValue);
  }, [toggleValue]);

  return (
    <div className=" flex flex-col space-y-5">
      <Text preset={TEXT_PRESET.heading4}>{title}</Text>
      <Text>{info}</Text>
      {children && <div>{children}</div>}
      <div className="flex items-center space-x-4">
        <Toggle
          name={name}
          disabled={disabled}
          checked={internalChecked}
          id={name}
          key={`${name}-${internalChecked}`}
          onCheckedChange={onToggle}
        >
          <ToggleControl />
          <ToggleLabel>
            <Text>
              {t(
                internalChecked
                  ? `${NAMESPACES.SERVICE}:service_state_enabled`
                  : `${NAMESPACES.SERVICE}:service_state_disabled`,
              )}
            </Text>
          </ToggleLabel>
        </Toggle>
      </div>
    </div>
  );
};
