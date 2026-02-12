import {
  Button,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  TEXT_PRESET,
  Text,
  INPUT_TYPE,
  Input,
} from '@ovhcloud/ods-react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type ManageViewDrawerTitleProps = {
  value: string;
  onChange: (value: string) => void;
};

export interface TitleEditorRef {
  save: () => string;
  isEditMode: boolean;
}

export const ManageViewDrawerTitle = forwardRef<
  TitleEditorRef,
  ManageViewDrawerTitleProps
>(({ value, onChange }: ManageViewDrawerTitleProps, ref) => {
  const { t } = useTranslation('dedicated-servers');
  const [isEditMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const save = () => {
    setEditMode(false);
    onChange(inputValue);
  };

  const cancel = () => {
    setEditMode(false);
  };

  useImperativeHandle(ref, () => ({
    save: () => {
      save();
      return inputValue;
    },
    isEditMode,
  }));

  return (
    <div className="w-full flex justify-between items-baseline gap-2 my-3">
      {isEditMode && (
        <>
          <Input
            type={INPUT_TYPE.text}
            placeholder={t('new_view')}
            value={inputValue}
            onChange={handleChange}
            className="flex-1 px-4 py-2"
          />
          <div>
            <Button
              role="button"
              variant={BUTTON_VARIANT.ghost}
              aria-label={t('edit_view_name')}
              onClick={save}
            >
              <Icon name={ICON_NAME.check} aria-hidden={true} />
            </Button>
            <Button
              role="button"
              color="neutral"
              variant={BUTTON_VARIANT.ghost}
              aria-label={t('edit_view_name')}
              onClick={cancel}
            >
              <Icon name={ICON_NAME.xmark} aria-hidden={true} />
            </Button>
          </div>
        </>
      )}
      {!isEditMode && (
        <>
          <Text preset={TEXT_PRESET.heading2}>{value}</Text>
          <Button
            role="button"
            className="max-w-fit max-h-fit"
            variant={BUTTON_VARIANT.ghost}
            aria-label={t('edit_view_name')}
            onClick={() => {
              setInputValue(value);
              setEditMode(true);
            }}
          >
            <Icon name={ICON_NAME.pen} aria-hidden={true} />
          </Button>
        </>
      )}
    </div>
  );
});

export default ManageViewDrawerTitle;
