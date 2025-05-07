import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem, useBreadcrumb } from './useBreadcrumb';

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
  it('should replace url path value with given item label', () => {
    // given rootlabel and items, when
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[0].label).toEqual(items[0].label);
  });

  it('should fallback to display url path value when no corresponding given item is found', () => {
    // given rootlabel and items, when
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[2].label).toEqual(locationPaths[2]);
  });

  it('should navigate to specified location item onClick call', () => {
    // given rootlabel and items
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // when
    result.current[1].onOdsClick();

    // then
    expect(useNavigateMock).toHaveBeenCalledWith(items[1].navigateTo);
  });

  it('should not have an onClick method when no corresponding given item is found ', () => {
    // given rootlabel and items, when
    const { result } = renderHook(() => useBreadcrumb({ items }));

    // then
    expect(result.current[2].onOdsClick).not.toBeDefined();
  });
});
