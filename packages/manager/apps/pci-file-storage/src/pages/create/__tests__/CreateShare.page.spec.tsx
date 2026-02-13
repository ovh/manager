import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import CreateSharePage from '@/pages/create/CreateShare.page';

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) => (
    <div>
      {items.map(({ label }) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  ),
}));

vi.mock('@/pages/create/components/form/CreateShareForm.component', () => ({
  CreateShareForm: () => <div data-testid="create-share-form">CreateShareForm</div>,
}));

vi.mock('@/data/hooks/catalog/useShareCatalog', () => ({
  useShareCatalog: () => ({
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useGetUser', () => ({
  useGetUser: () => ({
    ovhSubsidiary: 'FR',
  }),
}));

describe('CreateShare page', () => {
  it('should render breadcrumb', () => {
    render(<CreateSharePage />);

    expect(screen.getByText('title')).toBeVisible();
    expect(screen.getByText('CreateShareForm')).toBeVisible();
  });
});
