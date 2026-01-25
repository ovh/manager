import React from 'react';

import '@testing-library/jest-dom';
import { fetch } from 'cross-fetch';
import { vi } from 'vitest';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';

global.fetch = fetch;

// Handle unhandled promise rejections in tests to prevent Vitest warnings
const originalUnhandledRejection = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason, promise) => {
  // Check if this is a test-related rejection that we want to suppress
  if (reason instanceof Error && reason.message.includes('Navigation error')) {
    // Silently handle navigation errors in tests
    return;
  }
  // For other unhandled rejections, call the original handlers
  originalUnhandledRejection.forEach((handler) => {
    if (typeof handler === 'function') {
      handler(reason, promise);
    }
  });
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Translation: vi.fn(
    ({ children }: { children: (t: (key: string) => string) => React.ReactNode }) =>
      children((key: string) => key),
  ),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useHref: vi.fn(),
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = (await importOriginal<
    typeof import('@ovh-ux/manager-pci-common')
  >()) as unknown as Record<string, unknown>;
  return {
    ...actual,
    isDiscoveryProject: vi.fn(),
    useProject: () => ({
      data: { status: 'ok' },
    }),
    PciTrustedZoneBanner: () => <div data-testid="pci-trusted-zone-banner" />,
    useTrustedZoneBanner: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="text-cell">{children}</div>
    ),
    DatagridColumn: {},
    Datagrid: ({
      children,
      topbar,
      isLoading,
    }: {
      children?: React.ReactNode;
      topbar?: React.ReactNode;
      isLoading?: boolean;
    }) => (
      <div data-testid="datagrid">
        {isLoading ? (
          <div data-testid="loading-row" />
        ) : (
          <>
            <div data-testid="layout-topbar">{topbar}</div>
            {children}
          </>
        )}
      </div>
    ),
    ErrorBanner: ({ error }: { error: unknown }) => (
      <div data-testid="error-banner">{JSON.stringify(error)}</div>
    ),
    BaseLayout: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="base-layout">{children}</div>
    ),
    useResourcesV6: vi.fn(),
    Notifications: () => <div data-testid="notifications" />,
    useNotifications: vi.fn(() => ({
      addInfo: vi.fn(),
      addSuccess: vi.fn(),
      addError: vi.fn(),
    })),
    useFeatureAvailability: vi.fn(),
    usePciUrl: () => '#/pci/projects/123',
    ActionMenu: ({
      id,
      items,
      isCompact,
    }: {
      id: string;
      items: ActionMenuItem[];
      isCompact: boolean;
    }) => (
      <div data-testid="action-menu" data-id={id} data-is-compact={isCompact}>
        {items.map((item) => (
          <a
            key={item.id}
            data-testid={`action-item-${item.id}`}
            href={item.href}
            onClick={item.onClick}
          >
            {item.label}
          </a>
        ))}
      </div>
    ),
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  const mockOdsInput = React.forwardRef<
    HTMLInputElement,
    {
      value?: string;
      name?: string;
      onOdsChange?: (event: { detail: { value: string } }) => void;
      isDisabled?: boolean;
      isReadonly?: boolean;
      hasError?: boolean;
      maxlength?: string;
      [key: string]: unknown;
    }
  >(({ value, onOdsChange, name, isDisabled, isReadonly, hasError, maxlength, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const elementRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      setInternalValue(value || '');
    }, [value]);

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return undefined;

      // Mock the internals property for form control integration
      (
        element as HTMLElement & {
          internals?: Record<string, unknown>;
        }
      ).internals = {
        setFormValue: vi.fn(),
        setValidity: vi.fn(),
        checkValidity: vi.fn(() => true),
        reportValidity: vi.fn(() => true),
      };

      const handleOdsChange = (event: CustomEvent) => {
        const newValue = (event.detail as { value: string }).value;
        setInternalValue(newValue);
        if (onOdsChange) {
          onOdsChange({ detail: { value: newValue } });
        }
      };

      element.addEventListener('odsChange', handleOdsChange as EventListener);
      return () => {
        element.removeEventListener('odsChange', handleOdsChange as EventListener);
      };
    }, [onOdsChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (onOdsChange) {
        onOdsChange({ detail: { value: newValue } });
      }
    };

    // Create a component that can be found by querySelector('ods-input')
    const Component = 'ods-input' as React.ElementType;
    return (
      <Component
        ref={(el: HTMLElement) => {
          elementRef.current = el;
          if (ref) {
            if (typeof ref === 'function') {
              ref(el as HTMLInputElement);
            } else {
              ref.current = el as HTMLInputElement;
            }
          }
        }}
        data-testid="ods-input"
        name={name}
        value={internalValue}
        is-disabled={isDisabled?.toString()}
        is-readonly={isReadonly?.toString()}
        has-error={hasError?.toString()}
        maxlength={maxlength}
        onInput={handleChange}
        onChange={handleChange}
        {...props}
      />
    );
  });
  mockOdsInput.displayName = 'OdsInput';

  const mockOdsCheckbox = React.forwardRef<
    HTMLInputElement,
    {
      inputId: string;
      name?: string;
      isChecked?: boolean;
      isDisabled?: boolean;
      className?: string;
      children?: React.ReactNode;
      onClick?: () => void;
      onOdsChange?: (event: { detail: { checked: boolean } }) => void;
      class?: string;
      isRequired?: boolean;
      'is-required'?: boolean;
      [key: string]: unknown;
    }
  >(
    (
      { inputId, name, isChecked, isDisabled, className, children, onClick, onOdsChange, ...props },
      ref,
    ) => {
      const [internalChecked, setInternalChecked] = React.useState(isChecked || false);
      const elementRef = React.useRef<HTMLElement | null>(null);

      React.useEffect(() => {
        setInternalChecked(isChecked || false);
      }, [isChecked]);

      React.useEffect(() => {
        const element = elementRef.current;
        if (!element) return undefined;

        const handleOdsChange = (event: CustomEvent) => {
          const newChecked = (event.detail as { checked: boolean }).checked;
          setInternalChecked(newChecked);
          if (onOdsChange) {
            onOdsChange({ detail: { checked: newChecked } });
          }
        };

        element.addEventListener('odsChange', handleOdsChange as EventListener);
        return () => {
          element.removeEventListener('odsChange', handleOdsChange as EventListener);
        };
      }, [onOdsChange]);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        setInternalChecked(newChecked);
        if (onOdsChange) {
          onOdsChange({ detail: { checked: newChecked } });
        }
        if (onClick) {
          onClick();
        }
      };

      const Component = 'ods-checkbox' as React.ElementType;
      const { class: classProp, ...restProps } = props;
      return (
        <Component
          ref={(el: HTMLElement) => {
            elementRef.current = el;
            if (ref) {
              if (typeof ref === 'function') {
                ref(el as HTMLInputElement);
              } else {
                ref.current = el as HTMLInputElement;
              }
            }
          }}
          data-testid="ods-checkbox"
          input-id={inputId}
          name={name}
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          is-checked={internalChecked?.toString()}
          is-disabled={isDisabled?.toString()}
          is-required={(props['is-required'] || props.isRequired)?.toString()}
          class={
            `${typeof className === 'string' ? className : ''} ${typeof classProp === 'string' ? classProp : ''}`.trim() ||
            undefined
          }
          onClick={onClick}
          onChange={handleChange}
          {...restProps}
        >
          {children}
        </Component>
      );
    },
  );
  mockOdsCheckbox.displayName = 'OdsCheckbox';

  return {
    ...actual,
    OdsBadge: ({ color, label, ...props }: { color: string; label: string }) => (
      <div data-testid="status_badge" data-color={color} {...props}>
        {label}
      </div>
    ),
    OdsLink: ({ label, ...props }: { label: string; iconAlignment?: string }) => (
      <a data-testid="ods-link" {...props}>
        {label}
      </a>
    ),
    OdsSpinner: () => <div data-testid="ods-spinner" />,
    OdsMessage: ({
      color,
      children,
      isDismissible,
      ...props
    }: {
      color: string;
      children: React.ReactNode;
      isDismissible?: boolean;
    }) => (
      <div
        data-testid="ods-message"
        data-color={color}
        data-is-dismissible={isDismissible}
        {...props}
      >
        {children}
      </div>
    ),
    OdsText: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="ods-text" {...props}>
        {children}
      </div>
    ),
    OdsIcon: ({ name, ...props }: { name: string }) => (
      <div data-testid="ods-icon" data-name={name} {...props} />
    ),
    OdsCard: ({
      children,
      color,
      className,
      ...props
    }: {
      children: React.ReactNode;
      color?: string;
      className?: string;
    }) => (
      <div data-testid="ods-card" className={className} data-color={color} {...props}>
        {children}
      </div>
    ),
    OdsModal: ({
      isOpen,
      children,
      onOdsClose,
      isDismissible,
      ...restProps
    }: {
      isOpen: boolean;
      children: React.ReactNode;
      onOdsClose: () => void;
      isDismissible?: boolean;
    }) =>
      isOpen ? (
        <div
          data-testid="ods-modal"
          data-isopen={isOpen.toString()}
          data-isdismissible={isDismissible?.toString()}
          {...restProps}
          onClick={() => onOdsClose && onOdsClose()}
        >
          {children}
        </div>
      ) : null,
    OdsRadio: ({
      inputId,
      name,
      onClick,
      isChecked,
      ...props
    }: {
      inputId: string;
      name: string;
      onClick?: () => void;
      isChecked?: boolean;
    }) => (
      <input
        type="radio"
        id={inputId}
        name={name}
        data-testid="ods-radio"
        onClick={onClick}
        checked={isChecked}
        {...props}
      />
    ),
    OdsInput: mockOdsInput,
    OdsButton: ({
      label,
      onClick,
      className,
      isDisabled,
      isLoading,
      color,
      size,
      ...props
    }: {
      label: string;
      onClick?: () => void;
      className?: string;
      isDisabled?: boolean;
      isLoading?: boolean;
      color?: string;
      size?: string;
    }) => {
      const Component = 'ods-button' as React.ElementType;
      return (
        <Component
          className={className}
          onClick={onClick}
          data-testid="ods-button"
          label={label}
          is-disabled={isDisabled?.toString()}
          is-loading={isLoading?.toString()}
          color={color}
          size={size}
          {...props}
        >
          {label}
        </Component>
      );
    },
    OdsCheckbox: mockOdsCheckbox,
    OdsFormField: ({
      children,
      error,
      className,
      ...props
    }: {
      children: React.ReactNode;
      error?: string;
      className?: string;
    }) => {
      const Component = 'ods-form-field' as React.ElementType;
      return (
        <Component data-testid="ods-form-field" className={className} error={error} {...props}>
          {children}
        </Component>
      );
    },
    OdsDivider: ({ color, spacing, ...props }: { color?: string; spacing?: string }) => {
      const Component = 'ods-divider' as React.ElementType;
      return <Component data-testid="ods-divider" color={color} spacing={spacing} {...props} />;
    },
    OdsAccordion: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
    }) => {
      const Component = 'ods-accordion' as React.ElementType;
      return (
        <Component data-testid="ods-accordion" className={className} {...props}>
          {children}
        </Component>
      );
    },
    OdsSkeleton: ({
      width,
      height,
      className,
      ...props
    }: {
      width?: string;
      height?: string;
      className?: string;
    }) => {
      const Component = 'ods-skeleton' as React.ElementType;
      return (
        <Component
          data-testid="ods-skeleton"
          className={className}
          width={width}
          height={height}
          {...props}
        />
      );
    },
  };
});

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-core-api') = await importOriginal();
  return {
    ...actual,
    v6: {
      get: vi.fn(),
      delete: vi.fn(),
      post: vi.fn(),
    },
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
  };
});

// Mock the ShellContext to provide navigation and other shell functionality
const mockGetURL = vi.fn().mockResolvedValue('mocked-url');

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    ShellContext: React.createContext({
      shell: {
        navigation: {
          getURL: mockGetURL,
        },
      },
      environment: {
        getUser: () => ({
          ovhSubsidiary: 'FR',
          language: 'fr_FR',
        }),
      },
    }),
    useOvhTracking: () => ({
      trackClick: vi.fn(),
      trackPage: vi.fn(),
    }),
    PageType: {
      bannerInfo: 'bannerInfo',
      bannerError: 'bannerError',
    },
    PageLocation: {
      page: 'page',
      datagrid: 'datagrid',
      popup: 'popup',
      funnel: 'funnel',
    },
    ButtonType: {
      button: 'button',
      link: 'link',
    },
  };
});

// Mock the dashboard links hook globally
vi.mock('@/hooks/home/useProjectIdInLinks', () => ({
  useProjectIdInLinks: (items: unknown[]) => items,
}));
