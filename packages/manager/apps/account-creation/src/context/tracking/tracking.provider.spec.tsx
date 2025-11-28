import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TrackingPlugin } from '@ovh-ux/shell';
import { Region, User } from '@ovh-ux/manager-config';
import * as shellClient from '@ovh-ux/manager-react-shell-client';
import { TrackingProvider } from './tracking.provider';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from '@/tracking.constant';
import { useTrackingContext } from './useTracking';

const mockConfigureTracking = vi.fn();
// Mock dependencies
vi.mock('@ovh-ux/shell', () => ({
  TrackingPlugin: vi.fn().mockImplementation(() => ({
    configureTracking: mockConfigureTracking,
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  getClickProps: vi.fn((params) => params),
  getPageProps: vi.fn((params) => params),
}));

describe('TrackingProvider', () => {
  let mockPlugin: any;
  const mockRegion = Region.EU;
  const mockUser: User = {
    ovhSubsidiary: 'FR',
    email: 'test@example.com',
  } as User;

  const renderTrackingTest = (component: JSX.Element = <div>Test</div>) => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return component;
    };

    const renderResult = render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

    return {
      context: contextValue,
      ...renderResult,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockPlugin = {
      configureTracking: mockConfigureTracking,
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    };
    (TrackingPlugin as any).mockImplementation(() => mockPlugin);
  });

  it('should render DataUsagePolicy component', () => {
    render(
      <TrackingProvider region={mockRegion}>
        <div>Test</div>
      </TrackingProvider>,
    );

    expect(screen.getByTestId('data-usage-policy')).toBeInTheDocument();
  });

  it('should initialize TrackingPlugin and configure tracking', async () => {
    render(
      <TrackingProvider region={mockRegion}>
        <div>Test</div>
      </TrackingProvider>,
    );

    expect(TrackingPlugin).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockPlugin.configureTracking).toHaveBeenCalledWith(
        mockRegion,
        expect.any(Object),
        'fr_FR',
      );
    });
  });

  it('should provide trackClick, trackPage and setUser functions in context', () => {
    const { context } = renderTrackingTest();

    expect(context).toBeDefined();
    expect(context.trackClick).toBeDefined();
    expect(typeof context.trackClick).toBe('function');

    expect(context).toBeDefined();
    expect(context.trackPage).toBeDefined();
    expect(typeof context.trackPage).toBe('function');

    expect(context).toBeDefined();
    expect(context.setUser).toBeDefined();
    expect(typeof context.setUser).toBe('function');
  });

  it('should configure tracking when setUser is called', async () => {
    const { context } = renderTrackingTest();

    mockPlugin.configureTracking.mockClear();

    context.setUser(mockUser);

    await waitFor(() => {
      expect(mockPlugin.configureTracking).toHaveBeenCalledWith(
        mockRegion,
        mockUser,
        'fr_FR',
      );
    });
  });

  it('should call trackPage with correct parameters', async () => {
    const getPagePropsSpy = vi.spyOn(shellClient, 'getPageProps');
    const { context } = renderTrackingTest();

    const trackingParams = {
      pageName: 'test-page',
      pageType: 'form',
    };

    context.trackPage(trackingParams);

    await waitFor(() => {
      expect(getPagePropsSpy).toHaveBeenCalledWith({
        chapter1: UNIVERSE,
        chapter2: SUB_UNIVERSE,
        chapter3: APP_NAME,
        appName: APP_NAME,
        pageTheme: UNIVERSE,
        level2Config: LEVEL2,
        ...trackingParams,
        level2: LEVEL2[mockRegion].config.level2,
      });
    });

    expect(mockPlugin.trackPage).toHaveBeenCalledWith(
      expect.objectContaining({
        ...trackingParams,
        page_category: 'Authentication',
      }),
    );
  });

  it('should call trackPage with custom pageCategory', async () => {
    const { context } = renderTrackingTest();

    const trackingParams = {
      pageName: 'test-page',
      pageType: 'form',
      pageCategory: 'CustomCategory',
    };

    context.trackPage(trackingParams);

    await waitFor(() => {
      expect(mockPlugin.trackPage).toHaveBeenCalledWith(
        expect.objectContaining({
          page_category: 'CustomCategory',
        }),
      );
    });
  });

  it('should call trackClick with correct parameters', async () => {
    const getClickPropsSpy = vi.spyOn(shellClient, 'getClickProps');
    const { context } = renderTrackingTest();

    const pageTracking = {
      pageName: 'test-page',
      pageType: 'form',
    };

    const clickParams = {
      location: 'header',
      buttonType: 'button',
      actions: ['click-action'],
      actionType: 'navigation',
    };

    context.trackClick(pageTracking, clickParams);

    await waitFor(() => {
      expect(getClickPropsSpy).toHaveBeenCalledWith({
        chapter1: UNIVERSE,
        chapter2: SUB_UNIVERSE,
        chapter3: APP_NAME,
        appName: APP_NAME,
        pageTheme: UNIVERSE,
        level2Config: LEVEL2,
        ...pageTracking,
        ...clickParams,
        level2: LEVEL2[mockRegion].config.level2,
      });
    });

    expect(mockPlugin.trackClick).toHaveBeenCalledWith(
      expect.objectContaining({
        page_category: 'Authentication',
      }),
    );
  });

  it('should call trackClick with custom pageCategory', async () => {
    const { context } = renderTrackingTest();

    const pageTracking = {
      pageName: 'test-page',
      pageType: 'form',
    };

    const clickParams = {
      location: 'header',
      buttonType: 'button',
      actions: ['click-action'],
      actionType: 'navigation',
      pageCategory: 'CustomClickCategory',
    };

    context.trackClick(pageTracking, clickParams);

    await waitFor(() => {
      expect(mockPlugin.trackClick).toHaveBeenCalledWith(
        expect.objectContaining({
          page_category: 'CustomClickCategory',
        }),
      );
    });
  });
});
