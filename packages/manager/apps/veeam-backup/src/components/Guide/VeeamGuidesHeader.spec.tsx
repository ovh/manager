import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { GUIDE_LIST, SUPPORT_URL } from '@/hooks/guide/guidesLinks.constant';
import VeeamGuidesHeader from './VeeamGuidesHeader';

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

describe('Veeam Guides Header tests suite', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <VeeamGuidesHeader />
      </QueryClientProvider>,
    );
  };

  it('should display all guides', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      let guideElement = getByTestId('guides_header_veeam_quick_start');
      expect(guideElement).toBeInTheDocument();
      let odsLinkElement = guideElement.closest('ods-link');
      expect(odsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.quickStart.FR}`,
      );

      guideElement = getByTestId('guides_header_veeam_usage');
      expect(guideElement).toBeInTheDocument();
      odsLinkElement = guideElement.closest('ods-link');
      expect(odsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.usage.FR}`,
      );

      guideElement = getByTestId('guides_header_veeam_faq');
      expect(guideElement).toBeInTheDocument();
      odsLinkElement = guideElement.closest('ods-link');
      expect(odsLinkElement).toHaveAttribute(
        'href',
        `${SUPPORT_URL.EU}${GUIDE_LIST.faq.FR}`,
      );
    });
  });
});
