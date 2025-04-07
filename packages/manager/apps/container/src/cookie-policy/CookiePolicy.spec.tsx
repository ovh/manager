import { render, waitFor } from '@testing-library/react';
import { it, vi, describe, expect } from 'vitest';
import { initShell } from '@ovh-ux/shell';
import CookiePolicy from './CookiePolicy';
import { Environment, User } from '@ovh-ux/manager-config';
import ApplicationContext from '@/context/application.context';
import { useCookies } from 'react-cookie';

const onValidate = vi.fn();
const trackingInit = vi.fn().mockResolvedValue(undefined);
const trackingSetEnabled = vi.fn().mockResolvedValue(undefined);
const trackingOnConsentModalDisplay = vi.fn().mockResolvedValue(undefined);

vi.mock('@ovh-ux/shell');

const renderCookiePolicy = async () => {
  const shell = initShell({} as Environment);
  const environment = shell.getPlugin('environment').getEnvironment();
  render(
    <ApplicationContext.Provider value={{ shell, environment }}>
      <CookiePolicy onValidate={onValidate} shell={shell} />
    </ApplicationContext.Provider>
  );
};

const mockedShell = (region: string) => ({
  getPlugin: (plugin: string) => ({
    environment: {
      getEnvironment: () => ({
        user: {
          ovhSubsidiary: region,
        } as User,
        getRegion: () => region,
      } as Environment),
    },
    tracking: {
      setRegion: vi.fn(),
      init: trackingInit,
      setEnabled: trackingSetEnabled,
      onConsentModalDisplay: trackingOnConsentModalDisplay,
    },
  }[plugin]),
});
vi.mock('react-cookie');


describe('CookiePolicy.component', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['EU', 'valid'],
    ['US', 'invalid'],
  ])('should init tracking if region is %s and cookie is %s', async (region, cookieValidity) => {

    const cookieValue = cookieValidity === 'valid' ? '1' : '0';
    vi.mocked(useCookies).mockReturnValue([{ MANAGER_TRACKING: cookieValue, }, vi.fn(), vi.fn()]);
    (await import('@ovh-ux/shell')).initShell = vi.fn().mockReturnValue(mockedShell(region));
    void renderCookiePolicy();
    await waitFor(() => {
      expect(trackingInit).toHaveBeenCalledWith(true);
      expect(trackingSetEnabled).not.toHaveBeenCalled();
      expect(trackingOnConsentModalDisplay).not.toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should show consent modal if cookie is null and region is not US', async () => {

    vi.mocked(useCookies).mockReturnValue([{ MANAGER_TRACKING: null, }, vi.fn(), vi.fn()]);
    (await import('@ovh-ux/shell')).initShell = vi.fn().mockReturnValue(mockedShell('EU'));
    void renderCookiePolicy();
    await waitFor(() => {
      expect(trackingInit).not.toHaveBeenCalled();
      expect(trackingSetEnabled).not.toHaveBeenCalled();
      expect(trackingOnConsentModalDisplay).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should disable tracking plugin if cookie is invalid and region is not US', async () => {

    vi.mocked(useCookies).mockReturnValue([{ MANAGER_TRACKING: '0', }, vi.fn(), vi.fn()]);
    (await import('@ovh-ux/shell')).initShell = vi.fn().mockReturnValue(mockedShell('EU'));
    void renderCookiePolicy();
    await waitFor(() => {
      expect(trackingInit).not.toHaveBeenCalled();
      expect(trackingSetEnabled).toHaveBeenCalledWith(false);
      expect(trackingOnConsentModalDisplay).not.toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
