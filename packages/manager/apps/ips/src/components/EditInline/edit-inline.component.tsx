import React, { PropsWithChildren, useState } from 'react';

import {
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Button,
  Input,
} from '@ovhcloud/ods-react';

export type EditInlineProps = {
  name: string;
  defaultValue?: string;
  onConfirm: (newValue: string) => void;
};

export const EditInline: React.FC<PropsWithChildren<EditInlineProps>> = ({
  name,
  defaultValue = '',
  onConfirm,
  children,
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  const onConfirmClick = () => {
    onConfirm(inputValue);
    setShowInput(false);
  };

  return (
    <>
      {!showInput && (
        <div className="flex items-center justify-between">
          <span>{children}</span>
          <Button
            variant={BUTTON_VARIANT.ghost}
            onClick={() => setShowInput(true)}
          >
            <Icon name={ICON_NAME.pen} />
          </Button>
        </div>
      )}
      {showInput && (
        <div className="flex items-center">
          <Input
            name={name}
            defaultValue={defaultValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            data-testid="edit-inline-input"
            className="min-w-full"
          />
          <Button className="mx-2" onClick={onConfirmClick}>
            <Icon name={ICON_NAME.check} />
          </Button>
          <Button
            onClick={() => setShowInput(false)}
            variant={BUTTON_VARIANT.outline}
          >
            <Icon name={ICON_NAME.xmark} />
          </Button>
        </div>
      )}
    </>
  );
};
