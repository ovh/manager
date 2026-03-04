import React, { PropsWithChildren, useState } from 'react';

import {
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Button,
  Input,
  BUTTON_SIZE,
} from '@ovhcloud/ods-react';

export type EditInlineProps = {
  name: string;
  defaultValue?: string;
  onConfirm: (newValue: string) => void;
  children: React.ReactNode;
  maxWidth?: number;
};

export const EditInline: React.FC<PropsWithChildren<EditInlineProps>> = ({
  name,
  defaultValue = '',
  onConfirm,
  children,
  maxWidth,
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
        <div className="flex flex-row items-center gap-3">
          <span
            className={
              maxWidth
                ? `max-w-[${maxWidth}px] overflow-hidden text-ellipsis`
                : ''
            }
          >
            {children}
          </span>
          <Button
            size={BUTTON_SIZE.xs}
            variant={BUTTON_VARIANT.ghost}
            onClick={() => setShowInput(true)}
          >
            <Icon name={ICON_NAME.pen} />
          </Button>
        </div>
      )}
      {showInput && (
        <div className="flex flex-col items-start gap-2">
          <Input
            className="min-w-full"
            name={name}
            defaultValue={defaultValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            data-testid="edit-inline-input"
          />
          <div className="flex gap-2">
            <Button size={BUTTON_SIZE.xs} onClick={onConfirmClick}>
              <Icon name={ICON_NAME.check} />
            </Button>
            <Button
              size={BUTTON_SIZE.xs}
              onClick={() => setShowInput(false)}
              variant={BUTTON_VARIANT.outline}
            >
              <Icon name={ICON_NAME.xmark} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
