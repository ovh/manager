import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem, useBreadcrumb } from './useBreadcrumb';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

const useNavigateMock = vi.fn();

vi.mock(`react-router-dom`, async (reactRouterDom) => {
  const module = await reactRouterDom<typeof import('react-router-dom')>();

  return {
    ...module,
    useNavigate: () => useNavigateMock,
    useLocation: vi.fn(),
  };
});

const rootLabel = 'root-label';

const locationPaths = ['123123', 'path', '234234'];

const locationPathname = '/'.concat(locationPaths.join('/'));

const items: BreadcrumbItem[] = [
  {
    id: locationPaths[0],
    label: 'a name from api result',
    navigateTo: `/${locationPaths[0]}`,
  },
  {
    id: locationPaths[1],
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
  it('should set the root item label', () => {
    // given
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[0].label).toEqual(
      'key_management_service_listing_title',
    );
  });

  it('should redirect to root path on root item onClick call', () => {
    // given rootlabel and items
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[0].navigateTo).toEqual(KMS_ROUTES_URLS.kmsListing);
  });

  it('should replace url path value with given item label', () => {
    // given
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[1].label).toEqual(items[1].label);
  });

  it('should fallback to display url path value when no corresponding given item is found', () => {
    // given
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[2].label).toEqual(locationPaths[2]);
  });

  it('should navigate to specified location item onClick call', () => {
    // given rootlabel and items
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[1].navigateTo).toEqual(items[1].navigateTo);
  });

  it('should not have a navigateTo url when no corresponding given item is found ', () => {
    // given
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[2].navigateTo).not.toBeDefined();
  });
});
