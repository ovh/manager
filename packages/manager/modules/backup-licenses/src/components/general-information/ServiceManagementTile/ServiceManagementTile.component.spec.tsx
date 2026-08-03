import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import ServiceManagementTile from './ServiceManagementTile.component';

const { useNavigationGetUrlMock } = vi.hoisted(() => ({
  useNavigationGetUrlMock: vi.fn().mockReturnValue({ data: 'https://account.example.com' }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return { ...actual, useNavigationGetUrl: useNavigationGetUrlMock };
});

describe('ServiceManagementTile', () => {
  it('renders formatted creation and next due dates', async () => {
    await renderWithProviders(
      <ServiceManagementTile
        creationDate="2027-04-15T00:00:00.000Z"
        nextBillingDate="2027-05-15T00:00:00.000Z"
        isLoading={false}
      />,
    );

    // Locale de test = fr_FR (cf. i18ntest.utils.ts) : date-fns rend les mois en français.
    expect(screen.getByText('15 avril 2027')).toBeInTheDocument();
    expect(screen.getByText('15 mai 2027')).toBeInTheDocument();
  });

  it('renders the contacts when present', async () => {
    await renderWithProviders(
      <ServiceManagementTile
        contacts={[{ customerCode: 'ad-1', type: 'administrator' }]}
        isLoading={false}
      />,
    );

    expect(screen.getByText('ad-1')).toBeInTheDocument();
  });

  it('hides the contacts section when there are none', async () => {
    await renderWithProviders(<ServiceManagementTile contacts={[]} isLoading={false} />);

    expect(screen.queryByText('field.contacts')).not.toBeInTheDocument();
  });

  it('always renders the terminate link, even without contacts', async () => {
    await renderWithProviders(<ServiceManagementTile isLoading={false} />);

    expect(document.querySelector('ods-link')).toHaveAttribute('label', 'Résilier la licence');
  });

  it('renders skeletons while loading, without the contacts section', async () => {
    await renderWithProviders(
      <ServiceManagementTile
        contacts={[{ customerCode: 'ad-1', type: 'administrator' }]}
        isLoading
      />,
    );

    expect(document.querySelectorAll('ods-skeleton')).toHaveLength(2);
    expect(screen.queryByText('ad-1')).not.toBeInTheDocument();
  });
});
