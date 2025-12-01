import { PropsWithChildren, useCallback, useState } from 'react';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  Input,
  Text,
  TextPreset,
} from '@ovhcloud/ods-react';

interface EditableTextProps extends PropsWithChildren {
  value: string;
  onUpdate: (updatedValue: string) => void;
  preset?: TextPreset;
  disabled?: boolean;
}

export const EditableText = (props: EditableTextProps) => {
  const { preset, disabled, value, onUpdate } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [currentValue, setCurrentValue] = useState<string>(value);

  const onValidateUpdate = useCallback(() => {
    onUpdate(currentValue);
    setIsEditing(false);
  }, [currentValue, onUpdate]);

  const onCancelUpdate = useCallback(() => {
    setCurrentValue(value);
    setIsEditing(false);
  }, [value]);

  const wrapperClassName = preset?.startsWith('heading-')
    ? 'flex align-middle leading-none'
    : 'flex align-middle';

  return isEditing ? (
    <span className={wrapperClassName}>
      <Input
        value={currentValue}
        className="-my-px"
        onChange={(e) => setCurrentValue(`${e.target.value}`)}
      />
      <Button
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.xs}
        className="ml-2 size-fit"
        onClick={onValidateUpdate}
      >
        <Icon name={ICON_NAME.check} />
      </Button>
      <Button
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.xs}
        className="ml-2 size-fit"
        onClick={onCancelUpdate}
      >
        <Icon name={ICON_NAME.xmark} />
      </Button>
    </span>
  ) : (
    <span className={wrapperClassName}>
      <Text preset={preset} disabled={disabled}>
        {value}
      </Text>
      <Button
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.xs}
        className="ml-2 size-fit"
        onClick={() => setIsEditing(true)}
      >
        <Icon name={ICON_NAME.pen} />
      </Button>
    </span>
  );
};
