import React, {
  ChangeEventHandler,
  ComponentProps,
  MouseEventHandler,
} from 'react';
import {
  OdsInput,
  OdsSwitch,
  OdsSwitchItem,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

/**
 * Mocks the OdsInput component
 */
type OdsInputProps = ComponentProps<typeof OdsInput>;

export const odsInputMock = (props: OdsInputProps) => {
  const handleChange = (props.onOdsChange as unknown) as ChangeEventHandler<
    HTMLInputElement
  >;

  return (
    <input
      id={props.id}
      key={props.key}
      name={props.name}
      value={props.value}
      data-testid={
        props['data-testid' as keyof ComponentProps<typeof OdsInput>]
      }
      onChange={handleChange}
      onBlur={handleChange}
    />
  );
};

/**
 * Mocks the OdsTextarea component
 */
type OdsTextareaProps = ComponentProps<typeof OdsTextarea>;

export const odsTextareaMock = (props: OdsTextareaProps) => {
  const handleChange = (props.onOdsChange as unknown) as ChangeEventHandler<
    HTMLTextAreaElement
  >;

  return (
    <textarea
      id={props.id}
      key={props.key}
      name={props.name}
      value={props.value}
      data-testid={
        props['data-testid' as keyof ComponentProps<typeof OdsTextarea>]
      }
      onChange={handleChange}
      onBlur={handleChange}
    />
  );
};

/**
 * Mocks the OdsSwitch component
 */
type OdsSwitchProps = ComponentProps<typeof OdsSwitch>;

export const odsSwitchMock = (props: OdsSwitchProps) => {
  return (
    <div data-testid={props['data-testid' as keyof OdsSwitchProps]}>
      {props.children}
    </div>
  );
};

/**
 * Mocks the OdsSwitchItem component
 */
type OdsSwitchItemProps = ComponentProps<typeof OdsSwitchItem>;

export const odsSwitchItemMock = (props: OdsSwitchItemProps) => {
  const handleClick = (props.onClick as unknown) as MouseEventHandler<
    HTMLButtonElement
  >;

  return (
    <button
      type="button"
      data-testid={props['data-testid' as keyof OdsSwitchItemProps]}
      data-checked={props.isChecked}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};
