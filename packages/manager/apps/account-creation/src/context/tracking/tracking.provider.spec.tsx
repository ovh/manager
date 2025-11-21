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
      );
    });
  });

  it('should provide trackClick, trackPage and setUser functions in context', () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.trackClick).toBeDefined();
    expect(typeof contextValue.trackClick).toBe('function');

    expect(contextValue).toBeDefined();
    expect(contextValue.trackPage).toBeDefined();
    expect(typeof contextValue.trackPage).toBe('function');

    expect(contextValue).toBeDefined();
    expect(contextValue.setUser).toBeDefined();
    expect(typeof contextValue.setUser).toBe('function');
  });

  it('should configure tracking when setUser is called', async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

    mockPlugin.configureTracking.mockClear();

    contextValue.setUser(mockUser);

    await waitFor(() => {
      expect(mockPlugin.configureTracking).toHaveBeenCalledWith(
        mockRegion,
        mockUser,
      );
    });
  });

  it('should call trackPage with correct parameters', async () => {
    const getPagePropsSpy = vi.spyOn(shellClient, 'getPageProps');
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

    const trackingParams = {
      pageName: 'test-page',
      pageType: 'form',
    };

    contextValue.trackPage(trackingParams);

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
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

    const trackingParams = {
      pageName: 'test-page',
      pageType: 'form',
      pageCategory: 'CustomCategory',
    };

    contextValue.trackPage(trackingParams);

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
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

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

    contextValue.trackClick(pageTracking, clickParams);

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
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTrackingContext();
      return <div>Test</div>;
    };

    render(
      <TrackingProvider region={mockRegion}>
        <TestComponent />
      </TrackingProvider>,
    );

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

    contextValue.trackClick(pageTracking, clickParams);

    await waitFor(() => {
      expect(mockPlugin.trackClick).toHaveBeenCalledWith(
        expect.objectContaining({
          page_category: 'CustomClickCategory',
        }),
      );
    });
  });
});
