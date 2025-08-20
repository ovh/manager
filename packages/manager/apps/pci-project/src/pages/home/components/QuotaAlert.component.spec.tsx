/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { QUOTA_LIMIT_GUIDES } from '@/constants';
import { useIsQuotaAboveThreshold, useQuotas } from '@/data/hooks/useQuota';
import { createWrapper } from '@/wrapperRenders';
import QuotaAlert from './QuotaAlert.component';

// Import the mocked function

vi.mock('@/hooks/useProjectIdFromParams', () => ({
  useProjectIdFromParams: vi.fn(() => '123'),
}));

vi.mock('@/data/hooks/useQuota', () => ({
  useQuotas: vi.fn(),
  useIsQuotaAboveThreshold: vi.fn(),
}));

vi.mock('react-i18next', async (importOriginal) => {
  const original: typeof import('react-i18next') = await importOriginal();
  return {
    ...original,
    Trans: ({ components }: { components?: Record<string, JSX.Element> }) => (
      <span>
        {components?.quotaGuidesLink}
        {components?.quotaUrl}
      </span>
    ),
  };
});

// Mock usePciUrl to return the expected URL
vi.mock('@ovh-ux/manager-pci-common', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...actual,
    usePciUrl: vi.fn(() => '#/pci/projects/123'),
    isDiscoveryProject: vi.fn(),
  };
});

const wrapper = createWrapper();

describe('QuotaAlert.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setQuotaState = ({
    data,
    isLoading,
    isAbove,
    isDiscovery,
  }: {
    data: unknown;
    isLoading: boolean;
    isAbove: boolean;
    isDiscovery: boolean;
  }) => {
    vi.mocked(useQuotas).mockReturnValue(({
      data,
      isLoading,
    } as unknown) as ReturnType<typeof useQuotas>);
    vi.mocked(useIsQuotaAboveThreshold).mockReturnValue(isAbove);
    vi.mocked(isDiscoveryProject).mockReturnValue(isDiscovery);
  };

  it('does not render while quotas are loading', () => {
    vi.mocked(useQuotas).mockReturnValue(({
      data: undefined,
      isLoading: true,
    } as unknown) as ReturnType<typeof useQuotas>);
    vi.mocked(useIsQuotaAboveThreshold).mockReturnValue(false);
    vi.mocked(isDiscoveryProject).mockReturnValue(false);

    const { container } = render(<QuotaAlert />, { wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('does not render when quota is below threshold', () => {
    vi.mocked(useQuotas).mockReturnValue(({
      data: [],
      isLoading: false,
    } as unknown) as ReturnType<typeof useQuotas>);
    vi.mocked(useIsQuotaAboveThreshold).mockReturnValue(false);
    vi.mocked(isDiscoveryProject).mockReturnValue(false);

    const { container } = render(<QuotaAlert />, { wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('does not render for discovery projects', () => {
    vi.mocked(useQuotas).mockReturnValue(({
      data: [],
      isLoading: false,
    } as unknown) as ReturnType<typeof useQuotas>);
    vi.mocked(useIsQuotaAboveThreshold).mockReturnValue(true);
    vi.mocked(isDiscoveryProject).mockReturnValue(true);

    const { container } = render(<QuotaAlert />, { wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('renders warning message with the guide link and the project quota link', () => {
    setQuotaState({
      data: [
        {
          instance: {
            maxInstances: 1,
            usedInstances: 1,
            maxCores: 1,
            usedCores: 1,
            maxRam: 1,
            usedRAM: 1,
          },
          volume: { maxGigabytes: 1, usedGigabytes: 1 },
          quotaAboveThreshold: true,
        },
      ],
      isLoading: false,
      isAbove: true,
      isDiscovery: false,
    });

    const { container } = render(<QuotaAlert />, { wrapper });

    const odsMessage = container.querySelector(
      '[data-testid="quota-alert_message"]',
    );
    expect(odsMessage).toBeVisible();

    const guidesLink = container.querySelector(
      '[data-testid="quota-alert_guides-link"]',
    );
    const quotaUrl = container.querySelector(
      '[data-testid="quota-alert_quota-url"]',
    );

    expect(guidesLink).toBeVisible();
    expect(quotaUrl).toBeVisible();

    const expectedGuideHref = QUOTA_LIMIT_GUIDES.FR;
    const expectedQuotaHref = '#/pci/projects/123/quota';

    expect(guidesLink?.getAttribute('href')).toBe(expectedGuideHref);
    expect(quotaUrl?.getAttribute('href')).toBe(expectedQuotaHref);
  });
});
