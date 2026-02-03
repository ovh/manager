import { KeyValuesErrorMessage } from '@secret-manager/components/messages/KeyValuesErrorMessage';
import { SecretData } from '@secret-manager/types/secret.type';
import { isKeyValueObject, objectToKeyValuePairs } from '@secret-manager/utils/key-value/keyValue';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Clipboard } from '@ovh-ux/muk';

import { KEY_VALUES_TEST_IDS } from './secretValueClipboards.constants';

type SecretValueClipboardsProps = {
  data: SecretData;
};

export const SecretValueClipboards = ({ data }: SecretValueClipboardsProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);

  if (!isKeyValueObject(data)) {
    return <KeyValuesErrorMessage />;
  }

  const keyValuePairs = objectToKeyValuePairs(data);

  return (
    <div className="space-y-2" data-testid={KEY_VALUES_TEST_IDS.container}>
      {keyValuePairs.map((item, index) => (
        <div
          key={item.key}
          className="flex items-center gap-2"
          data-testid={KEY_VALUES_TEST_IDS.pairItem(index)}
        >
          <FormField
            className="flex w-full flex-col space-y-1"
            data-testid={KEY_VALUES_TEST_IDS.pairItemKey(index)}
          >
            <FormFieldLabel>{t('key')}</FormFieldLabel>
            <Clipboard value={item.key} />
          </FormField>
          <FormField
            className="flex w-full flex-col space-y-1"
            data-testid={KEY_VALUES_TEST_IDS.pairItemValue(index)}
          >
            <FormFieldLabel>{t('value')}</FormFieldLabel>
            <Clipboard value={item.value} />
          </FormField>
        </div>
      ))}
    </div>
  );
};
