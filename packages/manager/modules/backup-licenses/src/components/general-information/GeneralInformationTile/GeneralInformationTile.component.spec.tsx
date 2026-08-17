import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import GeneralInformationTile from './GeneralInformationTile.component';

describe('GeneralInformationTile', () => {
  it('renders the reference and the service name', async () => {
    await renderWithProviders(
      <GeneralInformationTile
        reference="b1a7c3d4-0000"
        serviceName="My Backup Licenses"
        isProvisioning={false}
        isLoading={false}
      />,
    );

    expect(screen.getByText('b1a7c3d4-0000')).toBeInTheDocument();
    expect(screen.getByText('My Backup Licenses')).toBeInTheDocument();
  });

  it('renders an active VSPC access link when a URL is available', async () => {
    await renderWithProviders(
      <GeneralInformationTile
        reference="ref"
        serviceName="name"
        accessUrl="https://vspc.example.com"
        isProvisioning={false}
        isLoading={false}
      />,
    );

    const link = document.querySelector('ods-link');
    expect(link).toHaveAttribute('label', 'Accéder au VSPC');
    expect(link).toHaveAttribute('href', 'https://vspc.example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('replaces the link with a provisioning notice when the tenant is still being created', async () => {
    await renderWithProviders(
      <GeneralInformationTile
        reference="ref"
        serviceName="name"
        accessUrl="https://vspc.example.com"
        isProvisioning
        isLoading={false}
      />,
    );

    expect(screen.getByText('Disponible après provisionnement')).toBeInTheDocument();
    expect(document.querySelector('ods-link')).not.toBeInTheDocument();
  });

  it('falls back to the empty value placeholder when no link is available and provisioning is done', async () => {
    await renderWithProviders(
      <GeneralInformationTile
        reference="ref"
        serviceName="name"
        isProvisioning={false}
        isLoading={false}
      />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders skeletons while loading', async () => {
    await renderWithProviders(<GeneralInformationTile isProvisioning={false} isLoading />);

    expect(document.querySelectorAll('ods-skeleton')).toHaveLength(3);
  });
});
