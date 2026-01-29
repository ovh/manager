import { render, screen } from '@testing-library/react';
import { UseFormWatch } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceStatus } from '@/data/types/status';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import Step2 from '../step2';
import { FormValues } from '../types';

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

describe('Step2', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(
      <Step2
        watch={mockWatch as unknown as UseFormWatch<FormValues>}
        hosting={{
          countriesIp: [],
          hasHostedSsl: true,
        }}
      />,
      { wrapper },
    );
    expect(container).toBeInTheDocument();
  });

  it('should display summary information', () => {
    render(
      <Step2
        watch={mockWatch as unknown as UseFormWatch<FormValues>}
        hosting={{
          countriesIp: [],
          hasHostedSsl: true,
        }}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        multisiteTranslation.multisite_modal_domain_configuration_modify_step2_summary,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('test-domain.com')).toBeInTheDocument();
  });

  it('should display domain information', () => {
    render(
      <Step2
        watch={mockWatch as unknown as UseFormWatch<FormValues>}
        hosting={{
          countriesIp: [],
          hasHostedSsl: true,
        }}
      />,
      { wrapper },
    );

    expect(screen.getByText(commonTranslation.web_hosting_status_header_fqdn)).toBeInTheDocument();
  });

  it('should display CDN status', () => {
    render(
      <Step2
        watch={mockWatch as unknown as UseFormWatch<FormValues>}
        hosting={{
          countriesIp: [],
          hasHostedSsl: true,
        }}
      />,
    );

    expect(
      screen.getByText(multisiteTranslation.multisite_modal_domain_configuration_modify_step2_cdn),
    ).toBeInTheDocument();
  });
});
