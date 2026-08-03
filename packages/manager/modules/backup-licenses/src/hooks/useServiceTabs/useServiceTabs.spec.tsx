import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import { routeUrls } from '@/routes/routes.constants';
import { initTestI18n } from '@/test-utils/i18ntest.utils';

import { ServiceTab, useServiceTabs } from './useServiceTabs';

const renderTabs = async (pathname: string): Promise<ServiceTab[]> => {
  const i18n = await initTestI18n();
  const { result } = renderHook(() => useServiceTabs(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
      </I18nextProvider>
    ),
  });
  return result.current;
};

const activeTabNames = async (pathname: string) =>
  (await renderTabs(pathname)).filter((tab) => tab.isActive).map((tab) => tab.name);

describe('useServiceTabs', () => {
  it('marks the tab matching the current pathname as active', async () => {
    expect(await activeTabNames(routeUrls.linkedServers)).toEqual(['linked-servers']);
  });

  it('keeps the tab active on one of its sub-routes', async () => {
    expect(await activeTabNames(`${routeUrls.linkedServers}/add`)).toEqual(['linked-servers']);
  });

  it('marks no tab as active on an unrelated pathname', async () => {
    expect(await activeTabNames(routeUrls.onboarding)).toEqual([]);
  });

  // L'onglet Vaults était affiché désactivé en attendant sa route ; BKP-1221 la livre, donc il est
  // désormais navigable et actif sur son propre pathname.
  it('marks the vaults tab as active on its own pathname', async () => {
    const tabs = await renderTabs(routeUrls.vaults);
    const vaultsTab = tabs.find((tab) => tab.name === 'vaults');

    expect(vaultsTab?.isDisabled).toBeFalsy();
    expect(vaultsTab?.isActive).toBe(true);
  });
});
