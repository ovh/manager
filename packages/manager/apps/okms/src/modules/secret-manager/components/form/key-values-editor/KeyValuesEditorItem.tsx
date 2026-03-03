import { ChangeEventHandler } from 'react';

import { KeyValuePair } from '@secret-manager/utils/key-value/keyValue';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel, Icon, Input } from '@ovhcloud/ods-react';

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

  const handleKeyChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newKey = event.target.value?.toString();
    if (newKey !== undefined) {
      onChange({ key: newKey, value: item.value });
    }
  };

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value?.toString();
    if (newValue !== undefined) {
      onChange({ key: item.key, value: newValue });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FormField className="w-full">
        <FormFieldLabel>{t('key')}</FormFieldLabel>
        <Input
          name={keyInputName}
          data-testid={keyInputName}
          value={item.key}
          onChange={handleKeyChange}
          onBlur={onBlur}
          className="bg-white"
        />
      </FormField>
      <FormField className="w-full">
        <FormFieldLabel>{t('value')}</FormFieldLabel>
        <Input
          name={valueInputName}
          data-testid={valueInputName}
          value={item.value}
          onChange={handleValueChange}
          onBlur={onBlur}
          className="bg-white"
        />
      </FormField>

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
