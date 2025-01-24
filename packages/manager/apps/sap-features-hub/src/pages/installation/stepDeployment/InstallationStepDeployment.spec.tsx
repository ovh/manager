import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels } from '@/test-utils';
import InstallationStepDeployment from './InstallationStepDeployment.page';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '2', serviceName: 'pcc' }),
}));

const queryClient = new QueryClient();

describe('InstallationStepDeployment test suite', () => {
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

  it('should display the deployment setup form', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InstallationStepDeployment />
      </QueryClientProvider>,
    );

    assertTextVisibility(labels.installation.deployment_title);
    assertTextVisibility(labels.installation.deployment_subtitle);

    assertTextVisibility(
      labels.installation.deployment_input_application_version,
    );
    assertTextVisibility(labels.installation.deployment_input_application_type);
    assertTextVisibility(labels.installation.deployment_input_deployment_type);
  });
});
