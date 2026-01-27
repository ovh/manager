import React from 'react';
import { vi } from 'vitest';

export const OdsButtonMock = vi.fn().mockImplementation(({ children, onClick, label, isDisabled, ...props }) => (
  <button onClick={onClick} disabled={isDisabled} {...props}>
    {label || children}
  </button>
));

export const OdsTextMock = vi.fn().mockImplementation(({ children, ...props }) => (
  <span {...props}>{children}</span>
));

export const OdsMessageMock = vi.fn().mockImplementation(({ children, ...props }) => (
  <div {...props}>{children}</div>
));

export const OdsSelectMock = vi.fn().mockImplementation(({ children, onOdsChange, onOdsBlur, isDisabled, isRequired, name, ...props }) => (
  <select
    onChange={onOdsChange}
    onBlur={onOdsBlur}
    disabled={isDisabled}
    data-disabled={isDisabled}
    required={isRequired}
    data-testid={props['data-testid'] || (name ? `select-${name}` : undefined)}
    {...props}
  >
    {children}
  </select>
));

export const OdsComboboxItemMock = vi.fn().mockImplementation(({ children, ...props }) => (
  <option {...props}>{children}</option>
));

export const OdsComboboxMock = vi.fn().mockImplementation(({ children, onOdsChange, onOdsBlur, isDisabled, isRequired, name, ...props }) => (
  <select
    onChange={onOdsChange}
    onBlur={onOdsBlur}
    disabled={isDisabled}
    data-disabled={isDisabled}
    required={isRequired}
    data-testid={props['data-testid'] || (name ? `select-${name}` : undefined)}
    {...props}
  >
    {children}
  </select>
));

export const OdsFormFieldMock = vi.fn().mockImplementation(({ children, error, ...props }) => (
  <div {...props}>
    {children}
    {!!error && <div>{error}</div>}
  </div>
));

export const OdsCodeMock = vi.fn().mockImplementation(({ children, ...props }) => (
  <code {...props}>{children}</code>
));

export const OdsInputMock = vi.fn().mockImplementation(({ onOdsChange, onOdsBlur, value, name, ...props }) => (
  <input
    onChange={onOdsChange}
    onBlur={onOdsBlur}
    value={value}
    name={name}
    {...props}
  />
));

export const OdsSpinnerMock = vi.fn().mockImplementation(() => (
  <div data-testid="ods-spinner" />
));

export const OdsSkeletonMock = vi.fn().mockImplementation((props) => (
  <div data-testid={props['data-testid'] || 'ods-skeleton'} {...props} />
));

export const OdsBadgeMock = vi.fn().mockImplementation(({ children, label, ...props }) => (
  <span data-testid={props['data-testid'] || "badge"} {...props}>
    {label || children}
  </span>
));

export const OdsIconMock = vi.fn().mockImplementation(({ name, ...props }) => (
  <span data-testid="ods-icon" data-name={name} {...props} />
));

export const OdsTooltipMock = vi.fn().mockImplementation(({ children, ...props }) => (
  <div data-testid="ods-tooltip" {...props}>{children}</div>
));
