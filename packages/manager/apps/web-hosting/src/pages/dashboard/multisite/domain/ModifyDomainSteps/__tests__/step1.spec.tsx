import React from 'react';

import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceStatus } from '@/data/types/status';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import Step1 from '../step1';
import { FormValues } from '../types';

const TestWrapper = ({
  children,
}: {
  children: (control: ReturnType<typeof useForm<FormValues>>['control']) => React.ReactNode;
}) => {
  const { control } = useForm<FormValues>({
    defaultValues: {
      domain: 'test-domain.com',
      path: '/public_html',
      cdn: ServiceStatus.INACTIVE,
      firewall: ServiceStatus.INACTIVE,
      countriesIpEnabled: false,
      enableOwnLog: false,
      ownLog: '',
    },
  });
  return <>{children(control)}</>;
};

describe('Step1', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        {(control) => (
          <Step1
            control={control}
            isGitDisabled={true}
            isCdnAvailable={true}
            hosting={{
              hostingIp: '1.2.3.4',
              countriesIp: [],
              hasHostedSsl: true,
            }}
            zones={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );
    expect(container).toBeInTheDocument();
  });

  it('should display domain field', () => {
    render(
      <TestWrapper>
        {(control) => (
          <Step1
            control={control}
            isGitDisabled={true}
            isCdnAvailable={true}
            hosting={{
              hostingIp: '1.2.3.4',
              countriesIp: [],
              hasHostedSsl: true,
            }}
            zones={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(screen.getByText(commonTranslation.web_hosting_status_header_fqdn)).toBeInTheDocument();
  });

  it('should display warning when git is not disabled', () => {
    render(
      <TestWrapper>
        {(control) => (
          <Step1
            control={control}
            isGitDisabled={false}
            isCdnAvailable={true}
            hosting={{
              hostingIp: '1.2.3.4',
              countriesIp: [],
              hasHostedSsl: true,
            }}
            zones={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(
        multisiteTranslation.multisite_modal_domain_configuration_modify_git_warning,
      ),
    ).toBeInTheDocument();
  });
});
