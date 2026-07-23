import { render, waitFor } from '@testing-library/react';
import { it, vi, describe, expect, beforeEach } from 'vitest';
import { initShell } from '@ovh-ux/shell';
import { Environment, User } from '@ovh-ux/manager-config';
import { useCookies } from 'react-cookie';
import CookiePolicy from './CookiePolicy';
import ApplicationContext from '@/context/application.context';
import { WEBSITE_PRIVACY_COOKIE_NAME, WEBSITE_TRACKING_CONSENT_VALUE } from './CookiePolicy.constants';
import { cmp } from '@/cmp';
import type { CmpChoices } from '@/cmp';

const onValidate = vi.fn();
const trackingInit = vi.fn().mockResolvedValue(undefined);
const trackingSetEnabled = vi.fn().mockResolvedValue(undefined);
const trackingOnConsentModalDisplay = vi.fn().mockResolvedValue(undefined);
const trackingOnUserConsentFromModal = vi.fn().mockResolvedValue(undefined);

vi.mock('@ovh-ux/shell');

vi.mock('@/cmp', () => ({
  cmp: {
    load: vi.fn(),
    whenReady: vi.fn().mockResolvedValue(undefined),
    isError: vi.fn().mockReturnValue(false),
    getConsent: vi.fn().mockReturnValue(null),
    onConsentChange: vi.fn().mockReturnValue(() => {}),
    showPreferences: vi.fn(),
  },
}));

const mockedCmp = vi.mocked(cmp);

const renderCookiePolicy = async () => {
  const shell = initShell({} as Environment);
  const environment = shell.getPlugin('environment').getEnvironment();
  return render(
    <ApplicationContext.Provider value={{ shell, environment }}>
      <CookiePolicy onValidate={onValidate} shell={shell} />
    </ApplicationContext.Provider>,
  );
};

const mockedShell = (region: string) => ({
  getPlugin: (plugin: string) =>
    ({
      environment: {
        getEnvironment: () =>
          ({
            user: {
              ovhSubsidiary: region,
            } as User,
            getRegion: () => region,
            getUserLocale: () => 'fr_FR',
          } as Environment),
      },
      tracking: {
        setRegion: vi.fn(),
        init: trackingInit,
        setEnabled: trackingSetEnabled,
        onConsentModalDisplay: trackingOnConsentModalDisplay,
        onUserConsentFromModal: trackingOnUserConsentFromModal,
      },
    }[plugin]),
});
vi.mock('react-cookie');

const mockShellForRegion = async (region: string) => {
  (await import('@ovh-ux/shell')).initShell = vi
    .fn()
    .mockReturnValue(mockedShell(region));
};

const mockCookieValue = (value: string | null) => {
  vi.mocked(useCookies).mockReturnValue([
    { [WEBSITE_PRIVACY_COOKIE_NAME]: value },
    vi.fn(),
    vi.fn(),
  ]);
};

describe('CookiePolicy.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCmp.whenReady.mockResolvedValue(undefined);
    mockedCmp.isError.mockReturnValue(false);
    mockedCmp.getConsent.mockReturnValue(null);
    mockedCmp.onConsentChange.mockReturnValue(() => {});
    mockCookieValue(null);
  });

  it('US region: auto-enables tracking and never loads the CMP', async () => {
    await mockShellForRegion('US');
    renderCookiePolicy();
    await waitFor(() => {
      expect(trackingInit).toHaveBeenCalledWith(true);
      expect(mockedCmp.load).not.toHaveBeenCalled();
    });
  });

  it('EU with CMP analytics consent: enables tracking', async () => {
    mockedCmp.getConsent.mockReturnValue({ analytics: true } as CmpChoices);
    await mockShellForRegion('EU');
    renderCookiePolicy();
    await waitFor(() => {
      expect(mockedCmp.load).toHaveBeenCalledWith({
        locale: 'fr_FR',
        region: 'EU',
      });
      expect(trackingInit).toHaveBeenCalledWith(true);
      expect(trackingOnConsentModalDisplay).not.toHaveBeenCalled();
    });
  });

  it('EU with CMP analytics refused: disables tracking', async () => {
    mockedCmp.getConsent.mockReturnValue({ analytics: false } as CmpChoices);
    await mockShellForRegion('EU');
    renderCookiePolicy();
    await waitFor(() => {
      expect(trackingSetEnabled).toHaveBeenCalledWith(false);
      expect(trackingInit).not.toHaveBeenCalled();
    });
  });

  it('EU without consent yet: waits in beforeConsent mode, no legacy modal', async () => {
    mockedCmp.getConsent.mockReturnValue(null);
    await mockShellForRegion('EU');
    const { container } = await renderCookiePolicy();
    await waitFor(() => {
      expect(trackingOnConsentModalDisplay).toHaveBeenCalled();
      expect(trackingInit).not.toHaveBeenCalled();
    });
    // The consent UI is the CMP banner — the legacy OSDS modal must not show.
    expect(container.querySelector('osds-modal')).toBeNull();
  });

  it('forwards CMP consent changes to the tracking plugin', async () => {
    let consentCallback: (choices: CmpChoices) => void = () => {};
    mockedCmp.onConsentChange.mockImplementation((callback) => {
      consentCallback = callback;
      return () => {};
    });
    await mockShellForRegion('EU');
    renderCookiePolicy();
    await waitFor(() => expect(mockedCmp.onConsentChange).toHaveBeenCalled());

    consentCallback({ analytics: true });
    expect(trackingOnUserConsentFromModal).toHaveBeenCalledWith(true);

    consentCallback({ analytics: false });
    expect(trackingOnUserConsentFromModal).toHaveBeenCalledWith(false);
  });

  describe('CMP failure fallback (legacy TC_PRIVACY_CENTER path)', () => {
    beforeEach(() => {
      mockedCmp.isError.mockReturnValue(true);
    });

    it('inits tracking when the legacy cookie holds consent', async () => {
      mockCookieValue(WEBSITE_TRACKING_CONSENT_VALUE);
      await mockShellForRegion('EU');
      renderCookiePolicy();
      await waitFor(() => {
        expect(trackingInit).toHaveBeenCalledWith(true);
      });
    });

    it('shows the legacy modal when no legacy cookie exists', async () => {
      mockCookieValue(null);
      await mockShellForRegion('EU');
      const { container } = await renderCookiePolicy();
      await waitFor(() => {
        expect(trackingOnConsentModalDisplay).toHaveBeenCalled();
        expect(container.querySelector('osds-modal')).not.toBeNull();
      });
    });

    it('disables tracking when the legacy cookie refuses consent', async () => {
      mockCookieValue('0');
      await mockShellForRegion('EU');
      renderCookiePolicy();
      await waitFor(() => {
        expect(trackingSetEnabled).toHaveBeenCalledWith(false);
      });
    });
  });
});
