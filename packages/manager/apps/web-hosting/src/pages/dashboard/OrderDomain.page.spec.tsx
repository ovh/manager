import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import OrderDomainModal from './OrderDomain.page';

// Extend JSX to allow ods-radio element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ods-radio': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { value?: string },
        HTMLElement
      >;
    }
  }
}

vi.mock('@ovhcloud/ods-react', async (importActual) => {
  const actual = await importActual<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    RadioGroup: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Radio: ({
      value,
      onChange,
      ...props
    }: React.PropsWithChildren<{
      value?: string;
      onChange?: () => void;
      [key: string]: unknown;
    }>) => {
      const ref = React.useRef<HTMLElement>(null);
      React.useEffect(() => {
        const element = ref.current;
        if (element && onChange) {
          const handleOdsChange = () => onChange();
          element.addEventListener('odsChange', handleOdsChange);
          return () => {
            element.removeEventListener('odsChange', handleOdsChange);
          };
        }
      }, [onChange]);
      return React.createElement(
        'ods-radio',
        {
          ref,
          value,
          onClick: onChange,
          onKeyDown: onChange
            ? (e: React.KeyboardEvent) => e.key === 'Enter' && onChange()
            : undefined,
          tabIndex: 0,
          ...props,
        },
        null,
      );
    },
    RadioControl: () => null,
    RadioLabel: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  };
});

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

vi.mock('@/constants', async (importActual) => {
  const actual = await importActual<typeof import('@/constants')>();
  return {
    ...actual,
    DOMAIN_ORDER_URL: {
      FR: {
        FR: 'https://order.example/fr',
        DE: 'https://order.example/de',
      },
    },
  };
});

describe('OrderDomainModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('display radio button and validate button is disabled', () => {
    const { container } = render(<OrderDomainModal />, { wrapper: Wrappers as ComponentType });

    const orderRadio = container.querySelector('ods-radio[value="ORDER"]');
    const attachRadio = container.querySelector('ods-radio[value="ATTACH"]');
    expect(orderRadio).not.toBeNull();
    expect(attachRadio).not.toBeNull();

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();
  });

  it('select ORDER : activate button and open order page and close modal', () => {
    const { container } = render(<OrderDomainModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();

    const orderRadio = container.querySelector('ods-radio[value="ORDER"]');
    expect(orderRadio).not.toBeNull();

    fireEvent(
      orderRadio ??
        (() => {
          throw new Error('orderRadio not found');
        })(),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(primaryBtn).not.toBeDisabled();

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(primaryBtn);

    expect(openSpy.mock.calls.length).toBe(1);
    const [urlArg, targetArg] = openSpy.mock.calls[0];
    expect(urlArg).toBe('https://order.example/fr');
    expect(targetArg).toBe('_blank');

    expect(navigate.mock.calls.length).toBeGreaterThan(0);
  });

  it('select ATTACH : activate validate button and navigate to addDomain', () => {
    const { container } = render(<OrderDomainModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    const attachRadio = container.querySelector('ods-radio[value="ATTACH"]');

    fireEvent(
      attachRadio ??
        (() => {
          throw new Error('orderRadio not found');
        })(),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );
    expect(primaryBtn).not.toBeDisabled();

    fireEvent.click(primaryBtn);

    expect(navigate.mock.calls.length).toBe(1);
    const mocks = navigate.mock.calls[0];
    expect(mocks[0]).toBe('/serviceName/multisite/add-domain');
  });

  it('cancel button close modal', () => {
    render(<OrderDomainModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
