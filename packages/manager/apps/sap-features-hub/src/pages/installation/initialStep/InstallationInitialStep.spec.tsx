import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels } from '@/test-utils';
import InstallationInitialStep from './InstallationInitialStep.page';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '1' }),
}));

const queryClient = new QueryClient();

describe('InstallationInitialStep test suite', () => {
  // TODO: find a fix for Ods "this.attachInternals is not a function"
  // then: remove attachInternals mock below
  const originalAttachInternals = (Element.prototype as any).attachInternals;
  beforeEach(() => {
    (Element.prototype as any).attachInternals = vi.fn(() => ({
      ariaValueText: '',
      ariaDescription: '',
      setFormValue: vi.fn(),
    }));
  });
  afterEach(() => {
    (Element.prototype as any).attachInternals = originalAttachInternals;
  });

  it('should display the initialization form', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InstallationInitialStep />
      </QueryClientProvider>,
    );

    assertTextVisibility(labels.installation.service_title);
    assertTextVisibility(labels.installation.service_subtitle);

    assertTextVisibility(labels.installation.service_input_vmware);
    assertTextVisibility(labels.installation.service_input_vdc);
    assertTextVisibility(labels.installation.service_input_cluster);
  });
});
