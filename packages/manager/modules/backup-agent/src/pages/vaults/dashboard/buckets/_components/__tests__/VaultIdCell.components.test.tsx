import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { BucketNameCell } from '../BucketNameCell.component';
import { urlParams, urls } from "@/routes/Routes.constants";

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
  // eslint-disable-next-line react/no-multi-comp
  Links: ({ label, href }: { label: string; href: string }) => (
    <a data-testid="link" href={href}>
      {label}
    </a>
  ),
}));

const { useHref } = vi.hoisted(() => {
  return {
    useHref: vi.fn().mockImplementation((link) => link),
  };
});

vi.mock('react-router-dom', () => ({
  useHref
}));

describe('BucketNameCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const bucket = mockVaults[0]!.currentState.buckets[0]!;

    render(<BucketNameCell id={bucket.id} name={bucket.name} />);

    expect(useHref).toBeCalled();

    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent(bucket.name);
    expect(link.getAttribute('href')).toBe(urls.dashboardVaults.replace(urlParams.vaultId, bucket.id));
    expect(link.getAttribute('href')?.endsWith(`/${bucket.id}`)).toBe(true);
  });
});
