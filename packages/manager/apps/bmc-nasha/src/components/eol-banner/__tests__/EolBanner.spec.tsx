import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { useShell } from '@ovh-ux/manager-react-shell-client';

import { EolBanner } from '../EolBanner.component';

// Mock dependencies
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useShell: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params?.serviceName) {
        return `${key} ${params.serviceName}`;
      }
      return key;
    },
  }),
}));

describe('EolBanner', () => {
  const mockServiceName = 'nasha-test-1';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useShell).mockReturnValue({
      environment: {
        getUser: () => ({
          ovhSubsidiary: 'FR',
        }),
      },
    } as any);
  });

  it('should render EOL banner with service name', () => {
    render(<EolBanner serviceName={mockServiceName} />);

    expect(
      screen.getByText(/eol_lv1_lv2_services_banner_description_part_1/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/eol_lv1_lv2_services_banner_description_part_2/),
    ).toBeInTheDocument();
  });

  it('should render info link', () => {
    render(<EolBanner serviceName={mockServiceName} />);

    const link = screen.getByText(/eol_lv1_lv2_services_banner_info_link/);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

