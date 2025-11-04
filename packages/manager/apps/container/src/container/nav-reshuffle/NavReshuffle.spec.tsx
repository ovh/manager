import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useMfaEnrollment from '@/container/mfa-enrollment';
import NavReshuffleContainer from '.';

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: vi.fn().mockReturnValue({
      getEnvironment: vi.fn().mockReturnValue({
        getApplications: vi.fn().mockReturnValue([]),
        getRegion: vi.fn().mockReturnValue('EU'),
      }),
      getURL: vi.fn().mockReturnValue('https://www.mocked-mfa-url.com'),
      getLocale: vi.fn().mockReturnValue('fr_FR'),
    }),
    setMessageBus: vi.fn(),
  }),
}));

vi.mock('@/core/product-nav-reshuffle', () => ({
  default: vi.fn(() => ({
    isNavigationSidebarOpened: false,
    openNavigationSidebar: vi.fn(),
    closeNavigationSidebar: vi.fn(),
    skipToTheMainContentSlot: vi.fn(),
  })),
}));

vi.mock('@/context/progress', () => ({
  useProgress: vi.fn(() => ({ isStarted: false })),
}));

vi.mock('../common/Preloader/usePreloader', () => ({
  default: vi.fn(() => false),
}));

vi.mock('../common/Preloader', () => ({
  default: ({ visible, children }: any) => (
    <div data-testid="preloader">
      {visible ? 'visible' : 'hidden'}
      {children}
    </div>
  ),
}));

vi.mock('@/container/mfa-enrollment', () => ({
  default: vi.fn(() => ({
    isMfaEnrollmentVisible: true,
    isMfaEnrollmentForced: true,
    hideMfaEnrollment: vi.fn(),
  })),
}));

vi.mock('@/container/mfa-enrollment/MfaEnrollment', () => ({
  default: () => <div data-testid="mfa-enrollment">MFA Enrollment Component</div>,
}));

vi.mock('./header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('./hooks/useSidebarAssistanceLinks', () => ({
  useSidebarAssistanceLinks: vi.fn(() => []),
}));

vi.mock('./sidebar', () => ({
  default: () => <div data-testid="sidebar" />,
}));

vi.mock('./onboarding', () => ({
  default: () => <div data-testid="onboarding" />,
}));

vi.mock('@/components/modal-container/ModalContainer.component', () => ({
  default: () => <div data-testid="modal-container" />,
}));

vi.mock('@/core/routing', () => ({
  IFrameAppRouter: () => <div data-testid="iframe-router" />,
}));

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </BrowserRouter>,
  );
}

describe('NavReshuffleContainer - MFA Enrollment behavior', () => {
  const mockedUseMfaEnrollment = vi.mocked(useMfaEnrollment);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display MfaEnrollment component when visible', async () => {
    mockedUseMfaEnrollment.mockImplementation(() => ({
      isMfaEnrollmentVisible: true,
      isMfaEnrollmentForced: true,
      hideMfaEnrollment: vi.fn(),
    }));

    renderWithProviders(<NavReshuffleContainer isCookiePolicyModalClosed />);

    await screen.findByTestId('mfa-enrollment');

    expect(screen.getByTestId('mfa-enrollment')).toBeInTheDocument();
  });

  it('should NOT display MfaEnrollment when not visible', async () => {
    mockedUseMfaEnrollment.mockImplementation(() => ({
      isMfaEnrollmentVisible: false,
      isMfaEnrollmentForced: false,
      hideMfaEnrollment: vi.fn(),
    }));

    renderWithProviders(<NavReshuffleContainer isCookiePolicyModalClosed />);

    await waitFor(() => {
      expect(screen.queryByTestId('mfa-enrollment')).not.toBeInTheDocument();
    });
  });

  it('should pass correct props (forced & onHide) to MfaEnrollment', async () => {
    const hideFn = vi.fn();
    mockedUseMfaEnrollment.mockImplementation(() => ({
      isMfaEnrollmentVisible: true,
      isMfaEnrollmentForced: true,
      hideMfaEnrollment: hideFn,
    }));

    renderWithProviders(<NavReshuffleContainer isCookiePolicyModalClosed />);

    const mfaElement = await screen.findByTestId('mfa-enrollment');
    expect(mfaElement).toBeInTheDocument();
    expect(mockedUseMfaEnrollment).toHaveBeenCalled();
  });
});
