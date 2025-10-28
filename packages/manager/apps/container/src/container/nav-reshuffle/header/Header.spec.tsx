import { render, screen, waitFor, act } from '@testing-library/react';
import { useReket } from '@ovh-ux/ovh-reket';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { KeyPairName } from '@ovh-ux/manager-config';
import { fetchFeatureAvailabilityData } from '@ovh-ux/manager-react-components';
import { LEGAL_FORMS } from '@/container/common/constants';
import { links as constantLinks } from './user-account-menu/constants';
import UserAccountMenuButton from './user-account-menu/Button';
import HeaderComponent from './index';
import UserAccountMenu from './user-account-menu/Content';
import { UserLink } from './user-account-menu/UserLink';

/**
 * Mocked Data
 */

const mockedUser = {
  legalform: LEGAL_FORMS.INDIVIDUAL,
  organisation: 'Testcompany',
  name: 'TestUser',
  firstname: 'Test',
  email: 'test@example.com',
  nichandle: 'xx123456-xyz',
  enterprise: false,
  supportLevel: {
    level: 'standard',
  },
  auth: {
    method: 'user',
    user: 'ProviderUser',
  },
};

let mockedRegion = 'EU';

vi.mock('@ovh-ux/ovh-reket');
/**
 * Mocking hooks instead of queries/apies since there are a lot and hooks should be tested
 * in isolation instead of replicated in each test
 */
vi.mock('@ovh-ux/manager-react-components', async () => ({
  useFeatureAvailability: vi.fn().mockReturnValue([]),
  fetchFeatureAvailabilityData: vi.fn().mockReturnValue({
    'identity-documents': false,
    'procedures:fraud': false,
  }),
}));

vi.mock('@/core/notifications/useNotifications', () => ({
  default: vi.fn().mockReturnValue({
    notifications: [],
  }),
}));

vi.mock('@/hooks/useOnboardingPreferences', () => ({
  useOnboardingPreferences: vi.fn().mockReturnValue({
    data: {},
  }),
  useCreateOnboardingPreferences: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
  useUpdateOnboardingPreferences: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
}));

vi.mock('@/core/container', () => ({
  default: vi.fn().mockReturnValue({
    betaVersion: true,
    useBeta: true,
    updateBetaChoice: vi.fn(),
    setChatbotReduced: vi.fn(),
  }),
}));

vi.mock('@/context', async (original) => ({
  ...(await original()),
  useShell: vi.fn(() => ({
    getPlugin: vi.fn().mockReturnValue({
      getEnvironment: vi.fn().mockReturnValue({
        getApplications: vi.fn().mockReturnValue({}),
        getRegion: vi.fn().mockReturnValue(mockedRegion),
        getUser: vi.fn().mockReturnValue(mockedUser),
        user: mockedUser,
      }),
      onUserChange: vi.fn(),
      getLocale: vi.fn().mockReturnValue('en'),
      getURL: vi.fn((key) => `https://mockedurl.mock/${key}`),
      getAvailableLocales: vi.fn(() =>
        Array<KeyPairName>(
          { name: 'English', key: 'en_GB' },
          { name: 'Français', key: 'fr_FR' },
        ),
      ),
    }),
  })),
  useApplication: vi.fn(() => ({
    environment: {
      getUserLocale: vi.fn().mockReturnValue('en'),
    },
  })),
  useProgress: vi.fn(() => ({
    isStarted: false,
  })),
}));

vi.mock('@/context/header', () => ({
  useHeader: vi.fn(() => ({
    isAccountSidebarVisible: true,
    isAccountSidebarLargeScreenDisplayForced: false,
    setIsAccountSidebarVisible: vi.fn(),
    isNotificationsSidebarVisible: true,
    setIsNotificationsSidebarVisible: vi.fn(),
  })),
}));

vi.mock('react-i18next', async (importOriginal) => ({
  ...((await importOriginal())),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('Header.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the hamburger menu and logo on mobile', async () => {
    vi.mock('@/core/product-nav-reshuffle', () => ({
      default: vi.fn().mockReturnValue({ isMobile: true }),
    }));

    await act(async () => {
      const iframeRef = { current: document.createElement("iframe")};
      render(<HeaderComponent iframeRef={iframeRef} />);
    });

    await waitFor(() => {
      const hamburgerButton = screen.queryByTestId('hamburgerMenu');
      expect(hamburgerButton).toBeInTheDocument();
      // aria label is tested in the hamburger menu component
    });

    // check for logo
    expect(
      screen.queryByTitle('OVHcloud_master_logo_white_RGB'),
    ).toBeInTheDocument();
  });

  it.each([
    ['n individual', LEGAL_FORMS.INDIVIDUAL],
    [' corporation', LEGAL_FORMS.CORPORATION],
  ])(
    'should format the user name for a%s user correctly',
    async (_, legalForm) => {
      mockedUser.legalform = legalForm;
      await act(async () => {
        const iframeRef = { current: document.createElement("iframe")};
        render(<HeaderComponent iframeRef={iframeRef} />);
      });
      if (legalForm === LEGAL_FORMS.CORPORATION) {
        expect(screen.getByText(/Testcompany/)).toBeInTheDocument();
      } else {
        expect(screen.getByText(/Test TestUser/)).toBeInTheDocument();
      }
    },
  );

  describe('UserAccountMenu.component', async () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it.each([
      ['identity-documents', true, 'user_account_menu_my_identity_documents'],
      ['identity-documents', false, 'user_account_menu_my_identity_documents'],
      ['procedures:fraud', true, 'sidebar_account_kyc_documents'],
      ['procedures:fraud', false, 'sidebar_account_kyc_documents'],
    ])(
      'should render all expected links in the document for %s feature being %s',
      async (feature, isEnabled, specialLink) => {
        vi.mocked(fetchFeatureAvailabilityData).mockResolvedValue({
          [feature]: isEnabled,
        });
        vi.mocked(useReket).mockReturnValue({
          get: () => Promise.resolve({ status: 'open' }),
        });

        await act(async () => {
          render(
            <UserAccountMenu
              defaultPaymentMethod={{
                getStatusCategory: () => 'success',
              }}
              isLoading={false}
            />,
          );
        });

        await waitFor(() => {
          const linkElement = screen.queryByText(specialLink);
          if (isEnabled) {
            expect(linkElement).toBeInTheDocument();
            expect(linkElement.closest('a').getAttribute('aria-label')).toBe(
              specialLink,
            );
          } else {
            expect(linkElement).not.toBeInTheDocument();
          }
        });

        constantLinks.filter((link: UserLink) => !link.region || link.region.includes(mockedRegion)).forEach((link) => {
          const linkElement = screen.getByText(link.i18nKey);
          expect(linkElement).toBeInTheDocument();
          expect(linkElement.closest('a').getAttribute('aria-label')).toBe(
            link.i18nKey,
          );
        });

        const profileLink = screen.getByText('user_account_menu_profile');
        expect(profileLink).toBeInTheDocument();
        expect(profileLink.closest('a').getAttribute('aria-label')).toBe(
          'user_account_menu_profile',
        );

        // following two are chips
        expect(
          screen.queryByText(
            `user_account_menu_role_${mockedUser.auth.method}`,
          ),
        ).toBeInTheDocument();
        const supportLevelLink = screen.getByText(
          `user_account_menu_support_level_${mockedUser.supportLevel.level}`,
        );
        expect(supportLevelLink).toBeInTheDocument();
      },
    );

    it.each([
      ['billing', true, 'https://mockedurl.mock/billing'],
      ['account', true, 'https://mockedurl.mock/account']
    ])(
      'should render all expected links in the document for %s feature being %s',
      async (feature, isEnabled, specialUrl) => {
        vi.mocked(fetchFeatureAvailabilityData).mockResolvedValue({
          [feature]: isEnabled,
          'identity-documents': false,
          'procedures:fraud': false,
        });

        await act(async () => {
          render(
            <UserAccountMenu
              defaultPaymentMethod={{
                getStatusCategory: () => 'success',
              }}
              isLoading={false}
            />,
          );
        });

        const links = screen.getAllByRole('link');
        const specificLinks = links.filter((link) =>
          link.getAttribute('href').includes(specialUrl),
        );
        expect(specificLinks.length).toBeGreaterThan(0);
      },
    );

    it('should show the ticket link for US customers', async () => {
      vi.mocked(fetchFeatureAvailabilityData).mockResolvedValue({
        'identity-documents': false,
        'procedures:fraud': false,
      });

      mockedRegion = 'US';

      await act(async () => {
        render(
          <UserAccountMenu
            defaultPaymentMethod={{
              getStatusCategory: () => 'success',
            }}
            isLoading={false}
          />,
        );
      });
      expect(
        screen.getByText('user_account_menu_my_assistance_tickets'),
      ).toBeInTheDocument();
    });

    it.each([
      ['regular user', false, `${mockedUser.firstname} ${mockedUser.name}`],
      ['sub user', true, mockedUser.auth.user],
    ])(
      'should show the username and email for %s',
      async (_, isSubUser, userName) => {
        mockedUser.auth.method = isSubUser ? 'provider' : 'not-provider';

        await act(async () => {
          render(
            <UserAccountMenu
              defaultPaymentMethod={{
                getStatusCategory: () => 'success',
              }}
              isLoading={false}
            />,
          );
        });
        expect(screen.getByText(mockedUser.email)).toBeInTheDocument();
        expect(screen.getByText(userName)).toBeInTheDocument();
      },
    );
    it.each([
      ['should', 'normal user', false],
      ['should not', 'enterprise user', true],
    ])(
      '%s show the payment method badge for %s',
      async (_, userType, isEnterprise) => {
        mockedUser.enterprise = isEnterprise;
        await act(async () => {
          render(
            <UserAccountMenu
              defaultPaymentMethod={{
                getStatusCategory: () => 'success',
                status: 'VALID',
              }}
              isLoading={false}
            />,
          );
          waitFor(() => {
            const paymentMethodBadge = screen.queryByText(
              'user_account_menu_payment_method_status_VALID',
            );
            if (isEnterprise) {
              expect(paymentMethodBadge).not.toBeInTheDocument();
            } else {
              expect(paymentMethodBadge).toBeInTheDocument();
            }
          });
        });
      },
    );
  });

  describe('UserAccountMenuButton.component', () => {
    it.each([
      ['shown', true],
      ['hidden', false],
    ])('should have the correct aria labels when %s', (_, show) => {
      const { getByRole } = render(
        <UserAccountMenuButton onClick={vi.fn()} show={show} />,
      );
      // ODS buttons don't have the role button... maybe whe should add that
      expect(getByRole('button')).toBeInTheDocument();
      expect(getByRole('button').getAttribute('aria-haspopup')).toBe(`${show}`);
      expect(getByRole('button').getAttribute('aria-expanded')).toBe(`${show}`);
      expect(getByRole('button').getAttribute('aria-label')).toBe(
        'user_account_menu_manage_my_account',
      );
    });
  });
});
