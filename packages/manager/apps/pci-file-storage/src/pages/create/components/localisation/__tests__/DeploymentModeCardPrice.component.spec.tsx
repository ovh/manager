import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeploymentModeCardPrice } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeCardPrice.component';
import { TDeploymentModePrice } from '@/pages/create/view-model/shareCatalog.view-model';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getFormattedMonthlyCatalogPrice: (price: number) => `€${price}`,
  }),
}));

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Text: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
      <span className={className}>{children}</span>
    ),
  };
});

describe('DeploymentModeCardPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when monthlyPrice is null', () => {
    const { container } = render(<DeploymentModeCardPrice monthlyPrice={null} />);

    expect(container.innerHTML).toBe('');
  });

  it('should render leastPrice translation key when monthlyPrice is provided', () => {
    const monthlyPrice: TDeploymentModePrice = {
      value: 72000,
      isLeastPrice: true,
    };

    render(<DeploymentModeCardPrice monthlyPrice={monthlyPrice} />);

    expect(screen.getByText(/create:localisation\.deploymentMode\.leastPrice/)).toBeVisible();
  });

  it('should apply primary-700 color class', () => {
    const monthlyPrice: TDeploymentModePrice = {
      value: 36000,
      isLeastPrice: false,
    };

    render(<DeploymentModeCardPrice monthlyPrice={monthlyPrice} />);

    const el = screen.getByText(/create:localisation\.deploymentMode\.leastPrice/);
    expect(el.className).toContain('text-[--ods-color-primary-700]');
  });
});
