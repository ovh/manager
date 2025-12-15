import { KeyValuePair } from '@secret-manager/utils/key-value/keyValue';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import { OdsInputChangeEventDetail, OdsInputCustomEvent } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { Icon } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

import { KEY_VALUES_EDITOR_TEST_IDS } from './keyValuesEditor.constants';

type KeyValuesEditorItemProps = {
  index: number;
  item: KeyValuePair;
  onChange: (item: KeyValuePair) => void;
  onDelete: () => void;
  onBlur: () => void;
  isDeletable: boolean;
};

type OdsInputChangeEventHandler = (event: OdsInputCustomEvent<OdsInputChangeEventDetail>) => void;

export const KeyValuesEditorItem = ({
  index,
  item,
  onChange,
  onDelete,
  onBlur,
  isDeletable,
}: KeyValuesEditorItemProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const keyInputName = KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(index);
  const valueInputName = KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(index);

  const handleKeyChange: OdsInputChangeEventHandler = (event) => {
    const newKey = event.target.value?.toString();
    if (newKey !== undefined) {
      onChange({ key: newKey, value: item.value });
    }
  };

  const handleValueChange: OdsInputChangeEventHandler = (event) => {
    const newValue = event.target.value?.toString();
    if (newValue !== undefined) {
      onChange({ key: item.key, value: newValue });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <OdsFormField className="w-full">
        <label slot="label">{t('key')}</label>
        <OdsInput
          name={keyInputName}
          data-testid={keyInputName}
          value={item.key}
          onOdsChange={handleKeyChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>
      <OdsFormField className="w-full">
        <label slot="label">{t('value')}</label>

        <OdsInput
          name={valueInputName}
          data-testid={valueInputName}
          value={item.value}
          onOdsChange={handleValueChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>

      <Button
        data-testid={KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(index)}
        className={clsx('mt-5', {
          'opacity-0 group-hover:opacity-100 transition-opacity duration-100': !isDeletable,
          'opacity-100': isDeletable,
        })}
        size="sm"
        variant="ghost"
        onClick={onDelete}
        disabled={!isDeletable}
        aria-label={t(`${NAMESPACES.ACTIONS}:delete`)}
      >
        <Icon name="trash" />
      </Button>
    </div>
  );
};
