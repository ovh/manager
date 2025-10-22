import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton, OdsInput } from '@ovhcloud/ods-components/react';
import React, { PropsWithChildren, useState } from 'react';

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
          <OdsButton
            icon={ODS_ICON_NAME.pen}
            variant={ODS_BUTTON_VARIANT.ghost}
            label=""
            onClick={() => setShowInput(true)}
          />
        </div>
      )}
      {showInput && (
        <div className="flex items-center">
          <OdsInput
            name={name}
            defaultValue={defaultValue}
            onOdsChange={(event) => {
              setInputValue(event?.detail?.value as string);
            }}
            data-testid="edit-inline-input"
            className="min-w-full"
          />
          <OdsButton
            icon={ODS_ICON_NAME.check}
            label=""
            className="mx-2"
            onClick={onConfirmClick}
          />
          <OdsButton
            icon={ODS_ICON_NAME.xmark}
            label=""
            onClick={() => setShowInput(false)}
            variant={ODS_BUTTON_VARIANT.outline}
          />
        </div>
      )}
    </>
  );
};
