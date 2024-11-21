import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import KmsGuidesHeader from './KmsGuidesHeader';
import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';
import { GUIDE_LIST, SUPPORT_URL } from '@/hooks/guide/guidesLinks.constant';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

const environment = {
  getUser: vi.fn().mockReturnValue({ ovhSubsidiary: 'FR' }),
  getUserLocale: vi.fn().mockReturnValue('fr_FR'),
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getEnvironment: vi.fn(() => environment),
    },
    shell: {
      environment: {
        getEnvironment: vi.fn(() => environment),
      },
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return { ...module, useFeatureAvailability: vi.fn() };
});

describe('KMS Guides Header tests suite', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <KmsGuidesHeader />
      </QueryClientProvider>,
    );
  };

  it('should display all guides when feature flipping is true', async () => {
    // setup
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [FEATURES.KMIP_CONNECTION_GUIDE]: true,
        [FEATURES.KMS_USAGE_GUIDE]: true,
      },
    } as UseFeatureAvailabilityResult);

    // act
    const { getByText } = renderComponent();

    // then
    await waitFor(() => {
      let guideElement = getByText('guides_header_quick_start');
      expect(guideElement).toBeInTheDocument();
      let osdsLinkElement = guideElement.closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.quickStart.FR}`,
      );

      guideElement = getByText('guides_header_kms_usage');
      expect(guideElement).toBeInTheDocument();
      osdsLinkElement = guideElement.closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.usage.FR}`,
      );

      guideElement = getByText('guides_header_connect_kmip_product');
      expect(guideElement).toBeInTheDocument();
      osdsLinkElement = guideElement.closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.kmip.FR}`,
      );
    });
  });

  it('should only display quick start guide when feature flipping is false', async () => {
    // setup
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [FEATURES.KMIP_CONNECTION_GUIDE]: false,
        [FEATURES.KMS_USAGE_GUIDE]: false,
      },
    } as UseFeatureAvailabilityResult);

    // act
    const { getByText, queryByText } = renderComponent();

    // then
    await waitFor(() => {
      expect(getByText('guides_header_quick_start')).toBeInTheDocument();
      expect(queryByText('guides_header_kms_usage')).not.toBeInTheDocument();
      expect(
        queryByText('guides_header_connect_kmip_product'),
      ).not.toBeInTheDocument();
    });
  });
});
