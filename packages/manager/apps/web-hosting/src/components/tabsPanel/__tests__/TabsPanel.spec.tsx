import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { RenderOptions, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { wrapper } from '@/utils/test.provider';

import TabsPanel, { activatedTabs, useComputePathMatchers } from '../TabsPanel.component';

const tabs = [
  {
    name: '1',
    title: '1',
    to: '/1',
    pathMatchers: [/1/],
    trackingName: 'tab-1',
  },
  {
    name: '2',
    title: '2',
    to: '/2',
    pathMatchers: [/2/],
    trackingName: 'tab-2',
  },
  {
    name: '3',
    title: '3',
    to: '/3',
    pathMatchers: [/3/],
    trackingName: 'tab-3',
    hidden: true,
  },
  {
    name: '4',
    title: '4',
    to: '/4',
    pathMatchers: [/4/],
    trackingName: 'tab-4',
    isDisabled: true,
  },
];

describe('TabsPanel component', () => {
  const mockTrackClick = vi.fn();

  beforeEach(() => {
    vi.mocked(useOvhTracking).mockReturnValue({
      trackClick: mockTrackClick,
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    });
    mockTrackClick.mockClear();
  });

  it('should render correctly with first tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText, container } = render(<TabsPanel tabs={tabs} />, {
      wrapper,
    } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    expect(container).toBeInTheDocument();
    const link1 = getByText('1');
    const link2 = getByText('2');
    const link4 = getByText('4');
    await waitFor(() => {
      expect(link1).toHaveAttribute('aria-selected', 'true');
    });
    expect(link2).toHaveAttribute('aria-selected', 'false');
    expect(link4).toBeDisabled();
  });

  it('should render correctly with second tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/2',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText, container } = render(<TabsPanel tabs={tabs} />, {
      wrapper,
    } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    expect(container).toBeInTheDocument();
    const link1 = getByText('1');
    const link2 = getByText('2');
    await waitFor(() => {
      expect(link2).toHaveAttribute('aria-selected', 'true');
    });
    expect(link1).toHaveAttribute('aria-selected', 'false');
  });

  it('should handle disabled tab click correctly and prevent default behavior', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText } = render(<TabsPanel tabs={tabs} />, { wrapper } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    const link4 = getByText('4');

    fireEvent.click(link4);
    expect(navigate).not.toHaveBeenCalled();
    expect(mockTrackClick).not.toHaveBeenCalled();
  });

  it('should call trackClick and navigate when clicking on enabled tab', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText } = render(<TabsPanel tabs={tabs} />, { wrapper } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    const link2 = getByText('2');

    fireEvent.click(link2);

    expect(mockTrackClick).toHaveBeenCalledWith({
      location: 'page',
      buttonType: 'go-to-tab',
      actionType: 'navigation',
      actions: ['tab-2'],
    });
    expect(navigate).toHaveBeenCalledWith('/2');
  });

  it('should match tab by pathMatchers when pathname does not match exactly', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1/subpath',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText } = render(<TabsPanel tabs={tabs} />, { wrapper } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    const link1 = getByText('1');
    await waitFor(() => {
      expect(link1).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('should use first tab when no tab matches', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/unknown',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText } = render(<TabsPanel tabs={tabs} />, { wrapper } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    const link1 = getByText('1');
    await waitFor(() => {
      expect(link1).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('should handle tab with query parameters in to path', async () => {
    const tabsWithQuery = [
      {
        name: '1',
        title: '1',
        to: '/1?param=value',
        pathMatchers: [/1/],
        trackingName: 'tab-1',
      },
    ];
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '?param=value',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);
    const { getByText } = render(<TabsPanel tabs={tabsWithQuery} />, {
      wrapper,
    } as unknown as RenderOptions<
      typeof import('@testing-library/dom/types/queries'),
      HTMLElement,
      HTMLElement
    >);
    const link1 = getByText('1');
    await waitFor(() => {
      expect(link1).toHaveAttribute('aria-selected', 'true');
    });
  });
});

describe('activatedTabs function', () => {
  it('should return true when pathname matches one of the pathMatchers', () => {
    const pathMatchers = [/\/test/, /\/other/];
    const location = {
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>;
    expect(activatedTabs(pathMatchers, location)).toBe(true);
  });

  it('should return false when pathname does not match any pathMatchers', () => {
    const pathMatchers = [/\/test/, /\/other/];
    const location = {
      pathname: '/unknown',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>;
    expect(activatedTabs(pathMatchers, location)).toBe(false);
  });

  it('should return false when pathMatchers is empty', () => {
    const pathMatchers: RegExp[] = [];
    const location = {
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>;
    expect(activatedTabs(pathMatchers, location)).toBe(false);
  });
});

describe('useComputePathMatchers hook', () => {
  it('should replace :serviceName with actual serviceName from params', () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    const { result } = renderHook(() => useComputePathMatchers(['/hosting/:serviceName/test']), {
      wrapper,
    });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].test('/hosting/test-service/test')).toBe(true);
    expect(result.current[0].test('/hosting/other-service/test')).toBe(false);
  });

  it('should handle empty serviceName', () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: undefined });
    const { result } = renderHook(() => useComputePathMatchers(['/hosting/:serviceName/test']), {
      wrapper,
    });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].test('/hosting//test')).toBe(true);
  });

  it('should handle multiple routes', () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    const { result } = renderHook(
      () => useComputePathMatchers(['/hosting/:serviceName/test', '/hosting/:serviceName/other']),
      { wrapper },
    );
    expect(result.current).toHaveLength(2);
    expect(result.current[0].test('/hosting/test-service/test')).toBe(true);
    expect(result.current[1].test('/hosting/test-service/other')).toBe(true);
  });
});
