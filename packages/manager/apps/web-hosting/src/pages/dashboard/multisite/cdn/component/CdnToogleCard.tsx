import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_TEXT_PRESET,
  OdsToggleChangeEventDetail,
  OdsToggleCustomEvent,
} from '@ovhcloud/ods-components';
import { OdsText, OdsToggle } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface ToggleCardProps {
  title: string;
  info: string;
  name?: string;
  toggleValue?: boolean;
  isDisabled?: boolean;
  onToggle?: (event: unknown) => void;
  children?: React.ReactNode;
}

// OdsToggle web component seems to have an issue where the new value is not always detected
// As a temporary solution, the value is kept in sync with an internal state, like in sap-features-hub.
// TODO: ODS migration
export const ToggleCard: React.FC<ToggleCardProps> = ({
  name,
  title,
  info,
  toggleValue,
  isDisabled = false,
  onToggle,
  children,
}) => {
  const { t } = useTranslation([NAMESPACES.SERVICE]);
  const [internalChecked, setInternalChecked] = useState(!!toggleValue);

  const toggleId = `${name}-toggle`;

  useEffect(() => {
    setInternalChecked(!!toggleValue);
  }, [toggleValue]);

  return (
    <div className=" flex flex-col space-y-5">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{title}</OdsText>
      <OdsText>{info}</OdsText>
      {children && <div>{children}</div>}
      <div className="flex items-center space-x-4">
        <OdsToggle
          key={`${toggleId}-${internalChecked}`}
          name={title}
          isDisabled={isDisabled}
          value={toggleValue}
          onOdsChange={(e: OdsToggleCustomEvent<OdsToggleChangeEventDetail>) => {
            const newValue = !!e.detail.value;
            setInternalChecked(newValue);
            onToggle(newValue);
          }}
        />
        <OdsText>
          {t(
            toggleValue
              ? t(`${NAMESPACES.SERVICE}:service_state_enabled`)
              : t(`${NAMESPACES.SERVICE}:service_state_disabled`),
          )}
        </OdsText>
      </div>
    </div>
  );
};
