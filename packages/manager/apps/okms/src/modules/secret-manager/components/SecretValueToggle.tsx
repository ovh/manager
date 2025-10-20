import React from 'react';
import { OdsSwitch, OdsSwitchItem } from '@ovhcloud/ods-components/react';

export type SecretValueToggleState = 'key-value' | 'json';

type SecretValueToggleProps = {
  state: SecretValueToggleState;
  onChange: (state: SecretValueToggleState) => void;
};

export const SecretValueToggle = ({
  state,
  onChange,
}: SecretValueToggleProps) => {
  return (
    <OdsSwitch name="secretValueType">
      <OdsSwitchItem
        isChecked={state === 'key-value'}
        onClick={() => onChange('key-value')}
      >
        Clé valeur
      </OdsSwitchItem>
      <OdsSwitchItem
        isChecked={state === 'json'}
        onClick={() => onChange('json')}
      >
        JSON
      </OdsSwitchItem>
    </OdsSwitch>
  );
};
