import React from 'react';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { SetupServer, setupServer } from 'msw/node';
import { vi } from 'vitest';

import { Button as OdsButton } from '@ovhcloud/ods-react';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { ActionMenuProps, ButtonProps, LinkProps } from '@ovh-ux/muk';

declare global {
  var server: SetupServer;
  var __VERSION__: string;
}

// Patch for ODS - PointerEvent polyfill for jsdom
vi.stubGlobal('PointerEvent', MouseEvent);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
} as typeof ResizeObserver;

// For ODS Select - Mock scrollTo and scrollIntoView for HTMLElement
HTMLElement.prototype.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

const server = setupServer(
  ...toMswHandlers([...getAuthenticationMocks({ isAuthMocked: true, region: 'EU' })]),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.server;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.__VERSION__ = null;
  global.server = server;
});

afterAll(() => {
  server.close();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.__VERSION__;
});

afterEach(() => {
  server.resetHandlers();
});

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
}));

// Mock Monaco Editor as a textarea for tests (Monaco uses contenteditable, not compatible with userEvent)
vi.mock('@monaco-editor/react', () => {
  const MonacoMock = ({
    value = '',
    onChange,
    onMount,
    wrapperProps = {},
  }: {
    value?: string;
    onChange?: (value: string) => void;
    onMount?: (editor: { onDidBlurEditorWidget: (fn: () => void) => void }) => void;
    wrapperProps?: Record<string, unknown>;
  }) => {
    const blurCallbackRef = React.useRef<(() => void) | null>(null);
    React.useEffect(() => {
      onMount?.({
        onDidBlurEditorWidget: (fn: () => void) => {
          blurCallbackRef.current = fn;
          return {
            dispose: () => {
              blurCallbackRef.current = null;
            },
          };
        },
      });
    }, [onMount]);
    return (
      <textarea
        {...wrapperProps}
        data-testid={wrapperProps?.['data-testid']}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => blurCallbackRef.current?.()}
        rows={12}
      />
    );
  };
  return { default: MonacoMock, Editor: MonacoMock };
});

// Mocking ODS components
vi.mock('@ovh-ux/muk', async () => {
  const original = await vi.importActual('@ovh-ux/muk');
  return {
    ...original,
    Button: vi.fn((props: ButtonProps & { 'data-testid'?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iamActions, displayTooltip, tooltipPosition, loading, ...htmlProps } = props;
      return (
        <OdsButton data-testid={props['data-testid']} data-loading={loading} {...htmlProps}>
          {props.children}
        </OdsButton>
      );
    }),
    Link: vi.fn((props: LinkProps & { 'data-testid'?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iamActions, displayTooltip, ...htmlProps } = props;
      return (
        <a data-testid={props['data-testid']} href={htmlProps.href} {...htmlProps}>
          {props.children}
        </a>
      );
    }),
    ActionMenu: vi.fn((props: ActionMenuProps) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const { items, id, label, isCompact, isDisabled, isLoading } = props;

      return (
        <div data-testid={`action-menu-${id}`}>
          <button
            data-testid={`action-menu-trigger-${id}`}
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled || isLoading}
            type="button"
          >
            {!isCompact && (label || 'Actions')}
            {isCompact && '⋯'}
          </button>
          {isOpen && (
            <div data-testid={`action-menu-content-${id}`} role="menu">
              <ul className="menu-item-ul">
                {items.map((item) => (
                  <li key={item.id}>
                    {item.href ? (
                      <a
                        data-testid={`action-menu-item-${item.id}`}
                        href={item.href}
                        onClick={() => {
                          item.onClick?.();
                          setIsOpen(false);
                        }}
                        download={item.download}
                        target={item.target}
                        rel={item.rel}
                        className={item.className}
                        aria-disabled={item.isDisabled}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        data-testid={`action-menu-item-${item.id}`}
                        onClick={() => {
                          item.onClick?.();
                          setIsOpen(false);
                        }}
                        disabled={item.isDisabled}
                        type="button"
                        className={item.className}
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }),
  };
});
