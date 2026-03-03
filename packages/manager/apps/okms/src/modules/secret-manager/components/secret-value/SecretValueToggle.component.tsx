import { useTranslation } from 'react-i18next';

import { ButtonGroup, ButtonGroupItem, ButtonGroupValueChangeDetail } from '@ovhcloud/ods-react';

import { SECRET_VALUE_TOGGLE_TEST_IDS } from './secretValueToggle.constants';

export type SecretValueToggleState = 'key-value' | 'json';

const JSON_LABEL = 'JSON';

type SecretValueToggleProps = {
  state: SecretValueToggleState;
  onChange: (state: SecretValueToggleState) => void;
};

export const SecretValueToggle = ({ state, onChange }: SecretValueToggleProps) => {
  const { t } = useTranslation(['secret-manager']);

  const handleValueChange = (e: ButtonGroupValueChangeDetail) => {
    onChange(e.value[0] as SecretValueToggleState);
  };

  return (
    <div>
      <ButtonGroup
        data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.toggle}
        value={[state]}
        onValueChange={handleValueChange}
      >
        <ButtonGroupItem
          data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.keyValueToggle}
          value={'key-value'}
        >
          {t('key_value')}
        </ButtonGroupItem>
        <ButtonGroupItem data-testid={SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle} value={'json'}>
          {JSON_LABEL}
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
};
