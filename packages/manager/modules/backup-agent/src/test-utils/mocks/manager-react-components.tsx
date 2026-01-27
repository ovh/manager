import React from 'react';
import { vi } from 'vitest';

export const DataGridTextCellMock = vi.fn().mockImplementation(({ children }) => (
  <div data-testid="cell">{children}</div>
));

export const LinksMock = vi.fn().mockImplementation(({ label, href, children }) => (
  <a data-testid="link" href={href}>
    {label || children}
  </a>
));

export const ManagerButtonMock = vi.fn().mockImplementation(({ children, onClick, ...props }) => (
  <button
    onClick={onClick}
    data-testid={props['data-testid']}
    data-icon={props.icon}
    data-variant={props.variant}
    disabled={props.isDisabled}
  >
    {children}
  </button>
));

export const DrawerMock = vi.fn().mockImplementation(({
  children,
  heading,
  primaryButtonLabel,
  onPrimaryButtonClick,
  isPrimaryButtonDisabled,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  isSecondaryButtonDisabled,
}) => (
  <section data-testid="drawer">
    <h2>{heading}</h2>
    {children}
    <button onClick={onPrimaryButtonClick} disabled={isPrimaryButtonDisabled} data-disabled={isPrimaryButtonDisabled}>
      {primaryButtonLabel}
    </button>
    <button onClick={onSecondaryButtonClick} disabled={isSecondaryButtonDisabled} data-disabled={isSecondaryButtonDisabled}>
      {secondaryButtonLabel}
    </button>
  </section>
));

export const ActionMenuMock = vi.fn().mockImplementation(({ items }) => (
  <div data-testid="action-menu">
    {items.map((item: any) => (
      <button key={item.id} onClick={item.onClick} data-href={item.href}>
        {item.label}
      </button>
    ))}
  </div>
));

export const useNotificationsMock = vi.fn().mockImplementation(() => ({
  addSuccess: vi.fn(),
  addError: vi.fn(),
  addInfo: vi.fn(),
  addWarning: vi.fn(),
}));
