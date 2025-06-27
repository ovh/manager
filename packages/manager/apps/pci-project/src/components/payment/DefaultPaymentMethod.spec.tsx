import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import DefaultPaymentMethod from './DefaultPaymentMethod';
import { createWrapper } from '@/wrapperRenders';
import {
  TUserPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
  TPaymentMethodStatus,
} from '@/data/types/payment/payment-method.type';

// Mock the date formatter
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: vi.fn(() =>
    vi.fn(({ date, format }) => {
      if (format === 'MM/YYYY') {
        return '12/2025';
      }
      return date;
    }),
  ),
}));

describe('DefaultPaymentMethod', () => {
  const mockNavigationGetURL = vi.fn();

  const createMockShellContext = (): ShellContextType =>
    (({
      environment: {
        getUser: () => ({
          currency: { code: 'EUR' } as Currency,
          ovhSubsidiary: 'FR',
        }),
        getRegion: () => 'EU',
      },
      shell: {
        navigation: {
          navigateTo: vi.fn(),
          getURL: mockNavigationGetURL,
        },
      },
    } as unknown) as ShellContextType);

  const createMockPaymentMethod = (overrides = {}): TUserPaymentMethod => ({
    paymentMethodId: 123,
    paymentType: TPaymentMethodType.CREDIT_CARD,
    label: '1234567890123456',
    expirationDate: '2025-12-31',
    default: true,
    icon: {
      name: 'visa',
      data: undefined,
      url: 'https://example.com/visa.png',
      componentIcon: undefined,
    },
    integration: TPaymentMethodIntegration.COMPONENT,
    paymentSubType: null,
    billingContactId: null,
    creationDate: '2023-01-01',
    description: null,
    formSessionId: null,
    lastUpdate: '2023-01-01',
    merchantId: null,
    oneclick: null,
    paymentMeanId: null,
    status: TPaymentMethodStatus.VALID,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigationGetURL.mockResolvedValue(
      'https://billing.ovh.com/payment/method',
    );
  });

  it('should render component without crashing', () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should display the title correctly', () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(
      screen.getByText('pci_project_new_payment_default_title'),
    ).toBeInTheDocument();
  });

  it('should display explanation info', () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(
      screen.getByText('pci_project_new_payment_default_explain_info'),
    ).toBeInTheDocument();
  });

  it('should format credit card number correctly', () => {
    const mockMethod = createMockPaymentMethod({
      paymentType: TPaymentMethodType.CREDIT_CARD,
      label: '1234567890123456',
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(screen.getByText('····3456')).toBeInTheDocument();
  });

  it('should format bank account number correctly', () => {
    const mockMethod = createMockPaymentMethod({
      paymentType: TPaymentMethodType.BANK_ACCOUNT,
      label: 'FR7612345678901234567890123',
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(screen.getByText('····0123')).toBeInTheDocument();
  });

  it('should display PayPal label without formatting', () => {
    const mockMethod = createMockPaymentMethod({
      paymentType: TPaymentMethodType.PAYPAL,
      label: 'user@example.com',
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('should display expiration date badge when present', () => {
    const mockMethod = createMockPaymentMethod({
      expirationDate: new Date('2025-12-31'),
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'pci_project_new_payment_default_method_expiration_date',
      ),
    ).toBeInTheDocument();
  });

  it('should not display expiration date badge when not present', () => {
    const mockMethod = createMockPaymentMethod({
      expirationDate: undefined,
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(
      screen.queryByText(
        'pci_project_new_payment_default_method_expiration_date',
      ),
    ).not.toBeInTheDocument();
  });

  it('should display default badge', () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    expect(
      screen.getByText('pci_project_new_payment_default_method_badge_default'),
    ).toBeInTheDocument();
  });

  it('should display link to other payment methods', async () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'pci_project_new_payment_default_method_use_others_payment_methods',
        ),
      ).toBeInTheDocument();
    });

    expect(mockNavigationGetURL).toHaveBeenCalledWith(
      'dedicated',
      '#/billing/payment/method',
      {},
    );
  });

  it('should render PaymentIcon component', () => {
    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    const iconImage = container.querySelector(
      'img[src="https://example.com/visa.png"]',
    );
    expect(iconImage).toBeInTheDocument();
  });

  it('should handle empty label gracefully', () => {
    const mockMethod = createMockPaymentMethod({
      label: '',
    });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    // The component should still render even with empty label
    const labelElement = screen
      .getByTestId('ods-card')
      .querySelector('.font-bold');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent('');
  });

  it('should handle navigation URL error gracefully', async () => {
    // Mock the function to return a rejected promise
    mockNavigationGetURL.mockRejectedValue(new Error('Navigation error'));

    const mockMethod = createMockPaymentMethod();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <DefaultPaymentMethod method={mockMethod} />
      </Wrapper>,
    );

    // Wait for the component to handle the error
    await waitFor(() => {
      // The component should still render despite the navigation error
      expect(container.firstChild).toBeInTheDocument();
    });

    // Verify that the navigation function was called
    expect(mockNavigationGetURL).toHaveBeenCalledWith(
      'dedicated',
      '#/billing/payment/method',
      {},
    );
  });
});
