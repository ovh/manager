import React from 'react';

import { vi } from 'vitest';

export const OdsButtonMock = vi
  .fn()
  .mockImplementation(
    ({
      children,
      onClick,
      label,
      isDisabled,
      ...props
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      label?: string;
      isDisabled?: boolean;
    }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label || children}
      </button>
    ),
  );

export const OdsTextMock = vi
  .fn()
  .mockImplementation(({ children, ...props }: { children?: React.ReactNode }) => (
    <span {...(props as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>
  ));

export const OdsMessageMock = vi
  .fn()
  .mockImplementation(
    ({
      children,
      color,
      isDismissible = true,
      onOdsRemove,
      ...props
    }: {
      children?: React.ReactNode;
      color?: string;
      isDismissible?: boolean;
      onOdsRemove: () => void;
    }) => (
      <div
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
        data-color={color}
        data-is-dismissible={isDismissible}
      >
        {children}
        {isDismissible && (
          <button data-testid="ods-message-remove-button" onClick={onOdsRemove}>
            close
          </button>
        )}
      </div>
    ),
  );

export const OdsSelectMock = vi
  .fn()
  .mockImplementation(
    ({
      children,
      onOdsChange,
      onOdsBlur,
      isDisabled,
      isRequired,
      name,
      ...props
    }: {
      children?: React.ReactNode;
      onOdsChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
      onOdsBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
      isDisabled?: boolean;
      isRequired?: boolean;
      name?: string;
      'data-testid'?: string;
    }) => (
      <select
        onChange={onOdsChange}
        onBlur={onOdsBlur}
        disabled={isDisabled}
        data-disabled={isDisabled}
        required={isRequired}
        data-testid={props['data-testid'] || (name ? `select-${name}` : undefined)}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    ),
  );

export const OdsComboboxItemMock = vi
  .fn()
  .mockImplementation(({ children, ...props }: { children?: React.ReactNode }) => (
    <option {...(props as React.OptionHTMLAttributes<HTMLOptionElement>)}>{children}</option>
  ));

export const OdsComboboxMock = vi
  .fn()
  .mockImplementation(
    ({
      children,
      onOdsChange,
      onOdsBlur,
      isDisabled,
      isRequired,
      name,
      ...props
    }: {
      children?: React.ReactNode;
      onOdsChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
      onOdsBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
      isDisabled?: boolean;
      isRequired?: boolean;
      name?: string;
      'data-testid'?: string;
    }) => (
      <select
        onChange={onOdsChange}
        onBlur={onOdsBlur}
        disabled={isDisabled}
        data-disabled={isDisabled}
        required={isRequired}
        data-testid={props['data-testid'] || (name ? `select-${name}` : undefined)}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    ),
  );

export const OdsFormFieldMock = vi
  .fn()
  .mockImplementation(
    ({ children, error, ...props }: { children?: React.ReactNode; error?: string }) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
        {!!error && <div>{error}</div>}
      </div>
    ),
  );

export const OdsCodeMock = vi
  .fn()
  .mockImplementation(({ children, ...props }: { children?: React.ReactNode }) => (
    <code {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</code>
  ));

export const OdsInputMock = vi
  .fn()
  .mockImplementation(
    ({
      onOdsChange,
      onOdsBlur,
      value,
      name,
      ...props
    }: {
      onOdsChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onOdsBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
      value?: string | number;
      name?: string;
    }) => (
      <input
        onChange={onOdsChange}
        onBlur={onOdsBlur}
        value={value}
        name={name}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    ),
  );

export const OdsSpinnerMock = vi.fn().mockImplementation(() => <div data-testid="ods-spinner" />);

export const OdsSkeletonMock = vi
  .fn()
  .mockImplementation((props: { 'data-testid'?: string }) => (
    <div
      data-testid={props['data-testid'] || 'ods-skeleton'}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    />
  ));

export const OdsBadgeMock = vi
  .fn()
  .mockImplementation(
    ({
      children,
      label,
      ...props
    }: {
      children?: React.ReactNode;
      label?: string;
      'data-testid'?: string;
    }) => (
      <span
        data-testid={props['data-testid'] || 'badge'}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {label || children}
      </span>
    ),
  );

export const OdsIconMock = vi
  .fn()
  .mockImplementation(({ name, ...props }: { name?: string }) => (
    <span
      data-testid="ods-icon"
      data-name={name}
      {...(props as React.HTMLAttributes<HTMLSpanElement>)}
    />
  ));

export const OdsTooltipMock = vi
  .fn()
  .mockImplementation(({ children, ...props }: { children?: React.ReactNode }) => (
    <div data-testid="ods-tooltip" {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  ));
