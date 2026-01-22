import { ChangeEventHandler, ComponentProps, MouseEventHandler } from 'react';

import {
  OdsInput,
  OdsQuantity,
  OdsSwitch,
  OdsSwitchItem,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

type DataTestIdProps = {
  'data-testid'?: string;
};

/**
 * Mocks the OdsInput component
 */
type OdsInputProps = ComponentProps<typeof OdsInput> & DataTestIdProps;

export const odsInputMock = (props: OdsInputProps) => {
  const handleChange = props.onOdsChange as unknown as ChangeEventHandler<HTMLInputElement>;

  return (
    <input
      id={props.id}
      key={props.key}
      name={props.name}
      value={props.value ?? undefined}
      data-testid={props['data-testid']}
      onChange={handleChange}
      onBlur={handleChange}
    />
  );
};

/**
 * Mocks the OdsTextarea component
 */
type OdsTextareaProps = ComponentProps<typeof OdsTextarea> & DataTestIdProps;

export const odsTextareaMock = (props: OdsTextareaProps) => {
  const handleChange = props.onOdsChange as unknown as ChangeEventHandler<HTMLTextAreaElement>;

  return (
    <textarea
      id={props.id}
      key={props.key}
      name={props.name}
      value={props.value ?? undefined}
      data-testid={props['data-testid']}
      onChange={handleChange}
      onBlur={handleChange}
    />
  );
};

/**
 * Mocks the OdsQuantity component
 */
type OdsQuantityProps = ComponentProps<typeof OdsQuantity> & DataTestIdProps;

export const odsQuantityMock = (props: OdsQuantityProps) => {
  const handleChange = props.onOdsChange as unknown as ChangeEventHandler<HTMLInputElement>;
  const handleBlur = props.onOdsBlur as unknown as (() => void) | undefined;

  return (
    <input
      type="number"
      id={props.id}
      key={props.key}
      name={props.name}
      value={props.value ?? undefined}
      data-testid={props['data-testid']}
      min={props.min}
      max={props.max}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

/**
 * Mocks the OdsSwitch component
 */
type OdsSwitchProps = ComponentProps<typeof OdsSwitch> & DataTestIdProps;

export const odsSwitchMock = (props: OdsSwitchProps) => {
  return <div data-testid={props['data-testid']}>{props.children}</div>;
};

/**
 * Mocks the OdsSwitchItem component
 */
type OdsSwitchItemProps = ComponentProps<typeof OdsSwitchItem> & DataTestIdProps;

export const odsSwitchItemMock = (props: OdsSwitchItemProps) => {
  const handleClick = props.onClick as unknown as MouseEventHandler<HTMLButtonElement>;

  return (
    <button
      type="button"
      data-testid={props['data-testid']}
      data-checked={props.isChecked}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};
