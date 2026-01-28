import React from 'react';

import { render, screen } from '@testing-library/react';
import { UseFormWatch, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceStatus } from '@/data/types/status';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';

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

const mockWatch = vi.fn((field: string) => {
  const values: Record<string, string | boolean | undefined> = {
    domain: 'test-domain.com',
    path: '/public_html',
    cdn: ServiceStatus.ACTIVE,
    firewall: ServiceStatus.ACTIVE,
    countriesIpEnabled: false,
    ipLocation: undefined,
    ownLog: '',
  };
  return values[field];
});

describe('Step1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        {(control) => (
          <Step1
            control={control}
            isGitDisabled={true}
            watch={mockWatch as unknown as UseFormWatch<FormValues>}
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
            watch={mockWatch as unknown as UseFormWatch<FormValues>}
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
            watch={mockWatch as unknown as UseFormWatch<FormValues>}
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
