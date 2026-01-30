import { useLocation } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { KmsBreadcrumbItem, useBreadcrumb } from './useBreadcrumb';

const useNavigateMock = vi.fn();

vi.mock(`react-router-dom`, async (reactRouterDom) => {
  const module = await reactRouterDom<typeof import('react-router-dom')>();

  return {
    ...module,
    useNavigate: () => useNavigateMock,
    useLocation: vi.fn(),
  };
});

const locationPaths = ['123123', 'path', '234234'];

const locationPathname = '/'.concat(locationPaths.join('/'));

const items: KmsBreadcrumbItem[] = [
  {
    id: locationPaths[0] ?? '',
    label: 'a name from api result',
    navigateTo: `/${locationPaths[0]}`,
  },
  {
    id: locationPaths[1] ?? '',
    label: 'a translated value',
    navigateTo: `/${locationPaths[0]}/${locationPaths[1]}`,
  },
];

vi.mocked(useLocation).mockReturnValue({
  pathname: locationPathname,
  hash: '',
  key: '',
  state: '',
  search: '',
});

describe('useBreadcumb test suite', () => {
  const renderHookWithI18n = async () => {
    const wrapper = await testWrapperBuilder().withI18next().build();
    return renderHook(() => useBreadcrumb({ items }), { wrapper });
  };

  it('should set the root item label', async () => {
    // given
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[0]?.label).not.toEqual('key_management_service_listing_title');
    expect(result.current[0]?.label).toBeTruthy();
  });

  it('should redirect to root path on root item onClick call', async () => {
    // given rootlabel and items
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[0]?.navigateTo).toEqual(KMS_ROUTES_URLS.kmsListing);
  });

  it('should replace url path value with given item label', async () => {
    // given
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[1]?.label).toEqual(items[1]?.label);
  });

  it('should fallback to display url path value when no corresponding given item is found', async () => {
    // given
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[2]?.label).toEqual(locationPaths[2]);
  });

  it('should navigate to specified location item onClick call', async () => {
    // given rootlabel and items
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[1]?.navigateTo).toEqual(items[1]?.navigateTo);
  });

  it('should not have a navigateTo url when no corresponding given item is found', async () => {
    // given
    const { result } = await renderHookWithI18n();

    // then
    expect(result.current[2]?.navigateTo).not.toBeDefined();
  });
});
