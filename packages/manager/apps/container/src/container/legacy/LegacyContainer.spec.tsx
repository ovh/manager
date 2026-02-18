import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useMfaEnrollment from '@/container/mfa-enrollment';
import LegacyContainer from '.';

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      getPlugin: vi.fn((name: string) => {
        if (name === 'environment') {
          return { getEnvironment: () => ({ getApplications: () => [] as any, getRegion: () => 'EU' }) };
        }
        if (name === 'tracking') {
          return {
            waitForConfig: () => Promise.resolve(),
            trackMVTest: vi.fn(),
          };
        }
        return {};
      }),
      setMessageBus: vi.fn(),
    },
  }),
}));

vi.mock('@/context/progress', () => ({
  useProgress: vi.fn(() => ({ isStarted: false })),
}));

vi.mock('../common/Preloader/usePreloader', () => ({
  default: vi.fn(() => false),
}));

vi.mock('../common/Preloader', () => ({
  default: ({ visible, children }: any) => (
    <div data-testid="preloader">{visible ? 'visible' : 'hidden'}{children}</div>
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

vi.mock('@/components/modal-container/ModalContainer.component', () => ({
  default: () => <div data-testid="modal-container">ModalContainer</div>,
}));

vi.mock('./Header', () => ({
  default: () => <div data-testid="legacy-header">Header</div>,
}));

vi.mock('./server-sidebar', () => ({
  default: () => <div data-testid="server-sidebar">Server Sidebar</div>,
}));

vi.mock('./server-sidebar/SidebarOverlay', () => ({
  default: () => <div data-testid="sidebar-overlay">Overlay</div>,
}));

vi.mock('@/core/routing', () => ({
  IFrameAppRouter: () => <div data-testid="iframe-router">IFrame Router</div>,
}));

vi.mock('@/core/container', () => ({
  default: () => ({ betaVersion: true }),
}));

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </BrowserRouter>,
  );
}

describe('LegacyContainer', () => {
  const mockedUseMfaEnrollment = vi.mocked(useMfaEnrollment);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render MFA Enrollment when visible', async () => {
    mockedUseMfaEnrollment.mockImplementation(() => ({
      isMfaEnrollmentVisible: true,
      isMfaEnrollmentForced: true,
      hideMfaEnrollment: vi.fn(),
    }));

    renderWithProviders(<LegacyContainer isCookiePolicyModalClosed />);

    await screen.findByTestId('mfa-enrollment');
    expect(screen.getByTestId('mfa-enrollment')).toBeInTheDocument();
  });

  it('should NOT render MFA Enrollment when not visible', async () => {
    mockedUseMfaEnrollment.mockImplementation(() => ({
      isMfaEnrollmentVisible: false,
      isMfaEnrollmentForced: false,
      hideMfaEnrollment: vi.fn(),
    }));

    renderWithProviders(<LegacyContainer isCookiePolicyModalClosed />);

    await waitFor(() => {
      expect(screen.queryByTestId('mfa-enrollment')).not.toBeInTheDocument();
    });
  });

  it('should render modal container when cookie policy closed', async () => {
    renderWithProviders(<LegacyContainer isCookiePolicyModalClosed />);
    await screen.findByTestId('modal-container');
    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
  });

  it('should render header, sidebar, overlay', async () => {
    renderWithProviders(<LegacyContainer isCookiePolicyModalClosed />);

    expect(screen.getByTestId('legacy-header')).toBeInTheDocument();
    expect(screen.getByTestId('server-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();
  });

  it('should render iframe router', () => {
    renderWithProviders(<LegacyContainer isCookiePolicyModalClosed />);
    expect(screen.getByTestId('iframe-router')).toBeInTheDocument();
  });
});
