import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import Creation from './Creation.page';
import { createWrapper } from '@/wrapperRenders';

// Mock the shell context
const mockShellContext = ({
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUserLanguage: vi.fn(() => 'en_GB'),
    getUser: vi.fn(() => ({
      ovhSubsidiary: 'FR',
      nichandle: 'test-user',
      email: 'test@example.com',
    })),
  },
  shell: {
    navigation: {
      getURL: vi.fn((appName: string, path: string) =>
        Promise.resolve(`/${appName}${path}`),
      ),
    },
  },
} as unknown) as ShellContextType;

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockSetSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock cart hooks from @/data/hooks/useCart
const mockUseCreateAndAssignCart = vi.fn();
const mockUseGetCart = vi.fn();
const mockUseGetOrderProjectId = vi.fn();
const mockUseOrderProjectItem = vi.fn();
const mockUseAttachConfigurationToCartItem = vi.fn();

vi.mock('@/data/hooks/useCart', () => ({
  useCreateAndAssignCart: () => mockUseCreateAndAssignCart(),
  useGetCart: () => mockUseGetCart(),
  useGetOrderProjectId: () => mockUseGetOrderProjectId(),
  useOrderProjectItem: () => mockUseOrderProjectItem(),
  useAttachConfigurationToCartItem: () =>
    mockUseAttachConfigurationToCartItem(),
}));

// Mock useConfigForm hook
const mockUseConfigForm = vi.fn();

vi.mock('./hooks/useConfigForm', () => ({
  useConfigForm: () => mockUseConfigForm(),
}));

// Mock useStepper hook
const mockUseStepper = vi.fn();

vi.mock('./hooks/useStepper', () => ({
  Step: {
    Config: 0,
    Payment: 1,
    CreditConfirmation: 2,
  },
  useStepper: () => mockUseStepper(),
}));

// Mock useProjectCreation hook
const mockUseProjectCreation = vi.fn();

vi.mock('./hooks/useProjectCreation', () => ({
  useProjectCreation: () => mockUseProjectCreation(),
}));

// Mock useWillPayment hook
const mockUseWillPayment = vi.fn();

vi.mock('./hooks/useWillPayment', () => ({
  useWillPayment: () => mockUseWillPayment(),
}));

// Mock useAntiFraud hook
const mockUseAntiFraud = vi.fn();

vi.mock('./hooks/useAntiFraud', () => ({
  default: () => mockUseAntiFraud(),
}));

// Mock other hooks
const mockUseNotifications = vi.fn();
const mockUsePaymentRedirect = vi.fn();
const mockUseOrderPolling = vi.fn();

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => mockUseNotifications(),
  OvhSubsidiary: {},
  StepComponent: ({ children }: { children: ReactElement }) => (
    <div data-testid="step-component">{children}</div>
  ),
  Notifications: () => <div data-testid="notifications" />,
}));

vi.mock('@/hooks/payment/usePaymentRedirect', () => ({
  usePaymentRedirect: () => mockUsePaymentRedirect(),
}));

// Mock OVH components
vi.mock('@ovhcloud/ods-components/react', () => ({
  ODS_SPINNER_SIZE: {
    md: 'md',
  },
  OdsLink: ({ children }: { children: ReactElement }) => (
    <div data-testid="ods-link">{children}</div>
  ),
  OdsText: ({ children }: { children: ReactElement }) => (
    <div data-testid="ods-text">{children}</div>
  ),
}));

// Mock FullPageSpinner component
vi.mock('@/components/FullPageSpinner', () => ({
  default: () => (
    <div data-testid="full-page-spinner">
      <div data-testid="spinner-md">Loading...</div>
    </div>
  ),
}));

// Mock step components
vi.mock('./steps/ConfigStep', () => ({
  default: () => <div data-testid="config-step">Config Step</div>,
}));

vi.mock('./steps/PaymentStep', () => ({
  default: () => <div data-testid="payment-step">Payment Step</div>,
}));

vi.mock('./components/credit/CreditConfirmation.component', () => ({
  default: () => (
    <div data-testid="credit-confirmation">Credit Confirmation</div>
  ),
}));

const renderWithProviders = (component: ReactElement) => {
  const Wrapper = createWrapper(mockShellContext);

  return render(component, { wrapper: Wrapper });
};

describe('Creation Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseParams.mockReturnValue({ projectId: 'test-project-id' });

    mockUseGetCart.mockReturnValue({
      data: {
        cartId: 'test-cart-id',
        description: 'Test Cart',
        items: [],
        readOnly: false,
      },
      isLoading: false,
      error: null,
    });

    mockUseNotifications.mockReturnValue({
      addError: vi.fn(),
      addWarning: vi.fn(),
      addSuccess: vi.fn(),
      addInfo: vi.fn(),
    });

    mockUseOrderPolling.mockReturnValue({
      order: null,
      isPolling: false,
      error: null,
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });

    mockUseCreateAndAssignCart.mockReturnValue({
      mutate: vi.fn(),
      data: {
        cartId: 'created-cart-id',
        description: 'Created Cart',
        items: [],
        readOnly: false,
      },
      isLoading: false,
      error: null,
    });

    mockUseGetOrderProjectId.mockReturnValue({
      data: {
        itemId: 'test-project-item-id',
        cartId: 'test-cart-id',
        type: 'publicCloudProject',
      },
      isLoading: false,
      error: null,
    });

    mockUseOrderProjectItem.mockReturnValue({
      mutate: vi.fn(),
      data: {
        id: 'created-project-item',
        type: 'publicCloudProject',
        properties: {},
      },
      isLoading: false,
      error: null,
    });

    mockUseConfigForm.mockReturnValue({
      form: {},
      setForm: vi.fn(),
      isConfigFormValid: vi.fn(() => true),
      isLoading: false,
    });

    mockUseStepper.mockReturnValue({
      goToConfig: vi.fn(),
      goToPayment: vi.fn(),
      goToCreditConfirmation: vi.fn(),
      isConfigChecked: false,
      isConfigLocked: false,
      isPaymentOpen: false,
      isPaymentChecked: false,
      isPaymentLocked: true,
      isCreditConfirmationOpen: false,
      isCreditConfirmationChecked: false,
      isCreditConfirmationLocked: false,
    });

    mockUseProjectCreation.mockReturnValue({
      isSubmitting: false,
      needToCheckCustomerInfo: false,
      billingHref: '',
      handleProjectCreation: vi.fn(),
      handleCreditAndPay: vi.fn(),
    });

    mockUseWillPayment.mockReturnValue({
      isCreditPayment: false,
      creditAmount: null,
      needsSave: false,
      isSaved: false,
      canSubmit: true,
      hasDefaultPaymentMethod: false,
      savePaymentMethod: vi.fn(),
      handlePaymentStatusChange: vi.fn(),
      handleRegisteredPaymentMethodSelected: vi.fn(),
    });

    mockUseAttachConfigurationToCartItem.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    });

    mockUsePaymentRedirect.mockReturnValue({
      redirect: vi.fn(),
      isLoading: false,
      error: null,
    });

    mockUseAntiFraud.mockReturnValue({
      checkAntiFraud: vi.fn(),
      isPolling: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the creation page with step components', () => {
    renderWithProviders(<Creation />);

    expect(screen.getByTestId('config-step')).toBeInTheDocument();
    expect(screen.getByTestId('payment-step')).toBeInTheDocument();
  });

  it('should show spinner when cart or projectItem is null', () => {
    // Override the default mocks to return null data
    mockUseCreateAndAssignCart.mockReturnValue({
      mutate: vi.fn(),
      data: null, // No created cart
      isLoading: false,
      error: null,
    });

    mockUseGetCart.mockReturnValue({
      data: null, // No existing cart
      isLoading: false,
      error: null,
    });

    mockUseOrderProjectItem.mockReturnValue({
      mutate: vi.fn(),
      data: null, // No created project item
      isLoading: false,
      error: null,
    });

    mockUseGetOrderProjectId.mockReturnValue({
      data: null, // No existing project item
      isLoading: false,
      error: null,
    });

    renderWithProviders(<Creation />);

    expect(screen.getByTestId('full-page-spinner')).toBeInTheDocument();
  });

  it('should handle cart loading error', () => {
    const error = new Error('Failed to load cart');

    // Override all cart/project related mocks to return null
    mockUseCreateAndAssignCart.mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isLoading: false,
      error,
    });

    mockUseGetCart.mockReturnValue({
      data: null,
      isLoading: false,
      error,
    });

    mockUseOrderProjectItem.mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isLoading: false,
      error,
    });

    mockUseGetOrderProjectId.mockReturnValue({
      data: null,
      isLoading: false,
      error,
    });

    renderWithProviders(<Creation />);

    // Should show spinner when cart/projectItem is null
    expect(screen.getByTestId('full-page-spinner')).toBeInTheDocument();
  });

  it('should render config step by default', () => {
    renderWithProviders(<Creation />);

    expect(screen.getByTestId('config-step')).toBeInTheDocument();
  });

  it('should handle project ID from URL params', () => {
    const testProjectId = 'my-project-123';
    mockUseParams.mockReturnValue({ projectId: testProjectId });

    renderWithProviders(<Creation />);

    // Component should render properly regardless of params
    expect(screen.getByTestId('config-step')).toBeInTheDocument();
    expect(screen.getByTestId('payment-step')).toBeInTheDocument();
  });

  it('should initialize with correct default state', async () => {
    renderWithProviders(<Creation />);

    await waitFor(() => {
      expect(screen.getByTestId('config-step')).toBeInTheDocument();
      expect(screen.getByTestId('payment-step')).toBeInTheDocument();
    });

    // Verify hooks are called
    expect(mockUseGetCart).toHaveBeenCalled();
    expect(mockUseProjectCreation).toHaveBeenCalled();
    expect(mockUseWillPayment).toHaveBeenCalled();
  });

  it('should handle project creation submission', () => {
    const mockHandleProjectCreation = vi.fn();

    mockUseProjectCreation.mockReturnValue({
      isSubmitting: false,
      needToCheckCustomerInfo: false,
      billingHref: '',
      handleProjectCreation: mockHandleProjectCreation,
      handleCreditAndPay: vi.fn(),
    });

    mockUseWillPayment.mockReturnValue({
      isCreditPayment: false,
      creditAmount: null,
      needsSave: false,
      isSaved: false,
      canSubmit: true,
      hasDefaultPaymentMethod: true, // Has default payment method
      savePaymentMethod: vi.fn(),
      handlePaymentStatusChange: vi.fn(),
      handleRegisteredPaymentMethodSelected: vi.fn(),
    });

    renderWithProviders(<Creation />);

    expect(mockUseProjectCreation).toHaveBeenCalled();
    expect(mockUseWillPayment).toHaveBeenCalled();
  });

  it('should handle credit payment flow', () => {
    mockUseWillPayment.mockReturnValue({
      isCreditPayment: true,
      creditAmount: { value: 100, currency: 'EUR' },
      needsSave: false,
      isSaved: false,
      canSubmit: true,
      hasDefaultPaymentMethod: false,
      savePaymentMethod: vi.fn(),
      handlePaymentStatusChange: vi.fn(),
      handleRegisteredPaymentMethodSelected: vi.fn(),
    });

    renderWithProviders(<Creation />);

    expect(mockUseWillPayment).toHaveBeenCalled();
  });

  it('should handle order polling state', () => {
    mockUseOrderPolling.mockReturnValue({
      order: { orderId: 'test-order-123' },
      isPolling: true,
      error: null,
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });

    renderWithProviders(<Creation />);

    // Component should render properly with order polling
    expect(screen.getByTestId('config-step')).toBeInTheDocument();
    expect(screen.getByTestId('payment-step')).toBeInTheDocument();
  });

  it('should handle cart with items', () => {
    mockUseGetCart.mockReturnValue({
      data: {
        cartId: 'test-cart-id',
        description: 'Cart with items',
        items: [
          { id: 'item-1', type: 'publicCloudProject' },
          { id: 'item-2', type: 'publicCloudCredit' },
        ],
        readOnly: false,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<Creation />);

    expect(mockUseGetCart).toHaveBeenCalled();
    expect(screen.getByTestId('config-step')).toBeInTheDocument();
    expect(screen.getByTestId('payment-step')).toBeInTheDocument();
  });

  it('should handle readonly cart', () => {
    mockUseGetCart.mockReturnValue({
      data: {
        cartId: 'readonly-cart',
        description: 'Readonly Cart',
        items: [],
        readOnly: true,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<Creation />);

    expect(mockUseGetCart).toHaveBeenCalled();
  });

  it('should render credit confirmation when isCreditConfirmationOpen is true', () => {
    mockUseStepper.mockReturnValue({
      goToConfig: vi.fn(),
      goToPayment: vi.fn(),
      goToCreditConfirmation: vi.fn(),
      isConfigChecked: true,
      isConfigLocked: true,
      isPaymentOpen: true,
      isPaymentChecked: true,
      isPaymentLocked: true,
      isCreditConfirmationOpen: true,
      isCreditConfirmationChecked: false,
      isCreditConfirmationLocked: false,
    });

    renderWithProviders(<Creation />);

    expect(screen.getByTestId('credit-confirmation')).toBeInTheDocument();
  });

  it('should call handleProjectCreation when isSaved becomes true', async () => {
    const mockHandleProjectCreation = vi.fn();

    mockUseProjectCreation.mockReturnValue({
      isSubmitting: false,
      needToCheckCustomerInfo: false,
      billingHref: '',
      handleProjectCreation: mockHandleProjectCreation,
      handleCreditAndPay: vi.fn(),
    });

    mockUseWillPayment.mockReturnValue({
      isCreditPayment: false,
      creditAmount: null,
      needsSave: false,
      isSaved: true, // This should trigger handleProjectCreation
      canSubmit: true,
      hasDefaultPaymentMethod: false,
      savePaymentMethod: vi.fn(),
      handlePaymentStatusChange: vi.fn(),
      handleRegisteredPaymentMethodSelected: vi.fn(),
    });

    renderWithProviders(<Creation />);

    await waitFor(() => {
      expect(mockHandleProjectCreation).toHaveBeenCalledWith({});
    });
  });
});
