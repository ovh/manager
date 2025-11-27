import { useTranslation } from 'react-i18next';

import { OdsSwitch, OdsSwitchItem } from '@ovhcloud/ods-components/react';

import { SECRET_VALUE_TOGGLE_TEST_IDS } from './secretValueToggle.constants';

export type SecretValueToggleState = 'key-value' | 'json';

const JSON_LABEL = 'JSON';

type SecretValueToggleProps = {
  state: SecretValueToggleState;
  onChange: (state: SecretValueToggleState) => void;
};

export const SecretValueToggle = ({ state, onChange }: SecretValueToggleProps) => {
  const { t } = useTranslation(['secret-manager']);

  return (
    <div>
      <OdsSwitch data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.toggle} name="secretValueType">
        <OdsSwitchItem
          data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.keyValueToggle}
          isChecked={state === 'key-value'}
          onClick={() => onChange('key-value')}
        >
          {t('key_value')}
        </OdsSwitchItem>
        <OdsSwitchItem
          data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle}
          isChecked={state === 'json'}
          onClick={() => onChange('json')}
        >
          {JSON_LABEL}
        </OdsSwitchItem>
      </OdsSwitch>
    </div>
  );
};
