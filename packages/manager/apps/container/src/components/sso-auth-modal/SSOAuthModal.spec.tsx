import { it, vi, describe, expect, Mock } from 'vitest';
import { render, waitFor, fireEvent, screen, act } from '@testing-library/react';
import {
  connectedToDisconnected,
  connectedToOther,
  disconnectedToConnected,
} from './ssoAuthModal.constants';
import SSOAuthModal from './SSOAuthModal.component';
import { useShell } from '@/context';


const mockedEmail = 'test@example.com';

vi.mock('@ovh-ux/manager-core-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...mod,
    fetchIcebergV6: vi.fn(),
    v6: {
      get: vi.fn(() =>
        Promise.resolve({
          data: { firstname: 'Test', name: 'User', email: mockedEmail, nichandle: 'test123' }
        })
      ),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('@/context', () => ({
  useShell: vi.fn(),
  useApplication: () => ({
    environment: { user: { firstname: 'Test', name: 'User', email: mockedEmail, nichandle: 'user123' } }
  }),
}));

vi.mock('react-i18next', async (importOriginal) => ({
  ...((await importOriginal())),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey || 'translated-text',
}));

describe('SSOAuthModal', () => {
  let logoutMock: Mock;
  let getSSOAuthModalModeMock: Mock;

  beforeEach(() => {
    logoutMock = vi.fn();
    getSSOAuthModalModeMock = vi.fn();

  (useShell as Mock).mockReturnValue({
      getPlugin: (pluginName: string) => {
        if (pluginName === 'auth') {
          return { logout: logoutMock };
        }
        if (pluginName === 'ux') {
          return {
            getUserIdCookie: vi.fn(() => 'userId123'),
            getSSOAuthModalMode: getSSOAuthModalModeMock,
          };
        }
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    { mode: connectedToDisconnected, expectedTexts: ['sso_modal_disconnected', 'sso_modal_user_title', 'sso_modal_action_logout'] },
    { mode: connectedToOther, expectedTexts: ['sso_modal_user_title', 'sso_modal_currentuser_title', 'sso_modal_what', 'sso_modal_action_logout', 'sso_modal_action_reload', mockedEmail] },
    { mode: disconnectedToConnected, expectedTexts: ['sso_modal_currentuser_title', 'sso_modal_what', 'sso_modal_action_logout', 'sso_modal_action_reload', mockedEmail] },
  ])('should display the correct message for mode $mode', async ({ mode, expectedTexts }) => {
    getSSOAuthModalModeMock.mockReturnValue(mode);

    render(<SSOAuthModal />);

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expectedTexts.forEach((expectedText) => {
        expect(screen.getByText(expectedText, { exact: false })).toBeInTheDocument();
      });
    });
  });

  it('should display the logout button and execute logout when clicked', async () => {
    getSSOAuthModalModeMock.mockReturnValue(connectedToOther);

    render(<SSOAuthModal />);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(screen.getByText('sso_modal_action_logout')).toBeInTheDocument();
    });
    const logoutButton = screen.getByText('sso_modal_action_logout');
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('should display the reload button and execute reload when clicked', async () => {
    getSSOAuthModalModeMock.mockReturnValue(disconnectedToConnected);

    render(<SSOAuthModal />);

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(screen.getByText('sso_modal_action_reload')).toBeInTheDocument();
    });

    const reloadButton = screen.getByText('sso_modal_action_reload');

    expect(reloadButton).toBeInTheDocument();

    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };

    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
    window.location = originalLocation;
  });
});
