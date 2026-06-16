import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

import { TunnelStepsSidebar } from './TunnelStepsSidebar.component';

vi.mock('@/hooks/useTunnelLinks', () => ({
  useTunnelLinks: () => ({
    faq: 'https://help.ovhcloud.com/csm/fr-documentation',
    installGuide: 'https://docs.ovhcloud.com/fr/guides/storage-and-backup/backup-agent/first-configuration',
    orderBaremetal: 'https://www.ovhcloud.com/fr/bare-metal/',
    support: 'https://www.ovhcloud.com/fr/support-levels/',
    paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
  }),
}));

const renderSidebar = async (currentStep: 1 | 2) => {
  const wrapper = await testWrapperBuilder().withI18next().build();
  return render(<TunnelStepsSidebar currentStep={currentStep} />, { wrapper });
};

describe('TunnelStepsSidebar', () => {
  // TC-TNL-66 / TC-TNL-06
  it('marks step 1 as current with aria-current when on step 1', async () => {
    const { container } = await renderSidebar(1);
    const currentEls = container.querySelectorAll('[aria-current="step"]');
    expect(currentEls).toHaveLength(1);
    expect(currentEls[0]).toHaveTextContent('Étape 1');
  });

  it('moves aria-current to step 2 when on step 2', async () => {
    const { container } = await renderSidebar(2);
    const currentEls = container.querySelectorAll('[aria-current="step"]');
    expect(currentEls).toHaveLength(1);
    expect(currentEls[0]).toHaveTextContent('Étape 2');
  });

  // TC-TNL-08
  it('renders the FAQ card with an external link', async () => {
    const { container } = await renderSidebar(1);
    const faqLink = container.querySelector('ods-link[label="Consulter la FAQ"]');
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute('target', '_blank');
    expect(faqLink?.getAttribute('href')).toContain('help.ovhcloud.com');
  });
});
