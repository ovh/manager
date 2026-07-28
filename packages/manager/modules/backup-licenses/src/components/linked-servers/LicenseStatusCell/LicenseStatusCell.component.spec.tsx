import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseStatus } from '@/types/BackupServer.type';

import LicenseStatusCell from './LicenseStatusCell.component';

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé.
// Le libellé du badge est une prop du web component (non rendue en texte), d'où la lecture
// de l'attribut ; le libellé du rendu « en cours » est, lui, un enfant de `OdsText`.
const badge = () => document.querySelector('ods-badge');
const spinner = () => document.querySelector('ods-spinner');

describe('LicenseStatusCell', () => {
  it('renders the badge of the license status when no operation is in flight', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.INSTALLED} isInFlight={false} />,
    );

    expect(badge()?.getAttribute('label')).toBe('status.installed');
    expect(badge()?.getAttribute('color')).toBe('success');
    expect(spinner()).toBeNull();
  });

  it('forces the progress rendering while an operation is in flight, whatever the status', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.INSTALLED} isInFlight />,
    );

    expect(screen.getByText('status.updating')).toBeInTheDocument();
    expect(spinner()).not.toBeNull();
    expect(badge()).toBeNull();
  });

  it('keeps the creating label when a creation is in flight', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.CREATING} isInFlight />,
    );

    expect(screen.getByText('status.creating')).toBeInTheDocument();
  });

  it('renders a missing status as a creation in progress', async () => {
    await renderWithProviders(<LicenseStatusCell licenseStatus={null} isInFlight={false} />);

    expect(screen.getByText('status.creating')).toBeInTheDocument();
    expect(spinner()).not.toBeNull();
  });

  it('renders a critical badge when an operation has failed', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.CREATING} isInFlight={false} hasFailedTask />,
    );

    expect(badge()?.getAttribute('label')).toBe('status.error');
    expect(badge()?.getAttribute('color')).toBe('critical');
    expect(spinner()).toBeNull();
  });

  it('keeps the progress rendering when a failed task coexists with a running one', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.CREATING} isInFlight hasFailedTask />,
    );

    expect(screen.getByText('status.creating')).toBeInTheDocument();
    expect(badge()).toBeNull();
  });

  it('renders an unknown status as a badge showing the raw value', async () => {
    await renderWithProviders(<LicenseStatusCell licenseStatus="REVOKED" isInFlight={false} />);

    expect(badge()?.getAttribute('label')).toBe('REVOKED');
    expect(badge()?.getAttribute('color')).toBe('information');
    expect(spinner()).toBeNull();
  });

  it('renders a dedicated label when a deletion is in flight, instead of the generic updating one', async () => {
    await renderWithProviders(
      <LicenseStatusCell licenseStatus={LicenseStatus.INSTALLED} isInFlight isDeleting />,
    );

    expect(screen.getByText('status.deleting')).toBeInTheDocument();
    expect(screen.queryByText('status.updating')).not.toBeInTheDocument();
    expect(spinner()).not.toBeNull();
    expect(badge()).toBeNull();
  });

  it('keeps the error rendering when a failed task coexists with a deletion in flight', async () => {
    await renderWithProviders(
      <LicenseStatusCell
        licenseStatus={LicenseStatus.INSTALLED}
        isInFlight={false}
        isDeleting
        hasFailedTask
      />,
    );

    expect(badge()?.getAttribute('label')).toBe('status.error');
    expect(screen.queryByText('status.deleting')).not.toBeInTheDocument();
  });
});
