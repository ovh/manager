import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CookiesProvider } from 'react-cookie';
import { Region } from '@ovh-ux/manager-config';
import { TrackingPlugin } from '@ovh-ux/shell';
import Cookies from 'universal-cookie';
import { useDataUsageConsent } from './useDataUsageConsent';
import {
  WEBSITE_PRIVACY_COOKIE_NAME,
  WEBSITE_TRACKING_CONSENT_VALUE,
} from './useDataUsage.constants';

const trackingPluginMock = new TrackingPlugin();
trackingPluginMock.onUserConsentFromModal = vi.fn(
  async (consent: boolean) => {},
) as (consent: boolean) => Promise<void>;

const buildWrapper = (cookieValue?: string) => ({
  children,
}: PropsWithChildren) => {
  const cookie = new Cookies({ [WEBSITE_PRIVACY_COOKIE_NAME]: cookieValue });
  return <CookiesProvider cookies={cookie}>{children}</CookiesProvider>;
};

describe('useDataUsageConsent', () => {
  describe('useDataUsageConsent', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should indicate there is no need to request consent for US', async () => {
      const wrapper = buildWrapper();

      const { result } = renderHook(
        () => useDataUsageConsent(Region.US, trackingPluginMock),
        {
          wrapper,
        },
      );
      expect(result.current.shouldRequestConsent).toBe(false);
      expect(trackingPluginMock.onUserConsentFromModal).toHaveBeenCalledWith(
        false,
      );
    });

    it('should indicate there is no need to request consent if it is already accepted', async () => {
      const wrapper = buildWrapper(WEBSITE_TRACKING_CONSENT_VALUE);
      const { result } = renderHook(
        () => useDataUsageConsent(Region.EU, trackingPluginMock),
        {
          wrapper,
        },
      );
      expect(trackingPluginMock.onUserConsentFromModal).toHaveBeenCalledWith(
        true,
      );
      expect(result.current.shouldRequestConsent).toBe(false);
    });

    it('should indicate there is no need to request consent if it is already rejected', async () => {
      const wrapper = buildWrapper('0');

      const { result } = renderHook(
        () => useDataUsageConsent(Region.EU, trackingPluginMock),
        {
          wrapper,
        },
      );
      expect(trackingPluginMock.onUserConsentFromModal).toHaveBeenCalledWith(
        false,
      );
      expect(result.current.shouldRequestConsent).toBe(false);
    });

    it('should indicate there is a need to request consent if it was not yet requested', async () => {
      const wrapper = buildWrapper();

      const { result } = renderHook(
        () => useDataUsageConsent(Region.EU, trackingPluginMock),
        {
          wrapper,
        },
      );
      expect(result.current.shouldRequestConsent).toBe(true);
    });

    it('should indicate there is a need to request consent after consent was given', async () => {
      const wrapper = buildWrapper();

      const { result } = renderHook(
        () => useDataUsageConsent(Region.EU, trackingPluginMock),
        {
          wrapper,
        },
      );
      expect(result.current.shouldRequestConsent).toBe(true);
      await act(() => {
        result.current.setConsent(true);
      });
      expect(result.current.shouldRequestConsent).toBe(false);
      expect(trackingPluginMock.onUserConsentFromModal).toHaveBeenCalledWith(
        true,
      );
    });
  });
});
