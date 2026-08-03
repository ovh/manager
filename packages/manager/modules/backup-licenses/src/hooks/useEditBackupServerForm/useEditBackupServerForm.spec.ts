import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';
import { LicenseApiValue, LicenseFamily, VdpTier } from '@/types/Order.type';

import { useEditBackupServerForm } from './useEditBackupServerForm';

const buildServer = (overrides: Partial<BackupServerResource['currentState']> = {}) =>
  ({
    id: 'server-1',
    status: 'ENABLED',
    currentState: {
      id: 'server-1',
      displayName: 'VBR-CUST-SERV-01',
      externalIps: ['203.0.113.10/32'],
      privateIps: ['192.168.10.2/32'],
      licenseType: LicenseApiValue.VDP_PREMIUM,
      licenseStatus: LicenseStatus.INSTALLED,
      ...overrides,
    },
    currentTasks: [],
  }) as BackupServerResource;

describe('useEditBackupServerForm', () => {
  it('seeds the form from the server once it is available, license step open first', () => {
    const server = buildServer();
    const { result } = renderHook(() => useEditBackupServerForm(server));

    expect(result.current.form).toEqual({
      displayName: 'VBR-CUST-SERV-01',
      externalIp: '203.0.113.10',
      privateIp: '192.168.10.2',
    });
    expect(result.current.family).toBe(LicenseFamily.DATA_PLATFORM);
    expect(result.current.tier).toBe(VdpTier.PREMIUM);
    expect(result.current.license.step.isOpen).toBe(true);
    expect(result.current.server.step.isOpen).toBe(false);
  });

  it('does not re-seed the form when the server reference changes afterwards', () => {
    const server = buildServer();
    const { result, rerender } = renderHook(({ srv }) => useEditBackupServerForm(srv), {
      initialProps: { srv: server },
    });

    act(() => result.current.setField('displayName', 'renamed-by-user'));

    const refetchedServer = buildServer({ displayName: 'renamed-server-side' });
    rerender({ srv: refetchedServer });

    expect(result.current.form?.displayName).toBe('renamed-by-user');
  });

  it('validating the license step checks and locks it, then opens the server step', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.license.submit());

    expect(result.current.license.step).toMatchObject({
      isChecked: true,
      isLocked: true,
      isOpen: false,
    });
    expect(result.current.server.step.isOpen).toBe(true);
  });

  it('reopening the license step does not reset the server fields (independent domains)', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('displayName', 'new-name'));
    act(() => result.current.license.submit());
    act(() => result.current.license.edit());

    expect(result.current.form?.displayName).toBe('new-name');
    expect(result.current.license.step.isLocked).toBe(false);
  });

  it('reports a malformed IP immediately, without waiting for touch or submit', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('externalIp', 'not-an-ip'));

    expect(result.current.errors.externalIp).toBe('edit.field.public_ip.error');
  });

  it('reports no error for an emptied field before it is touched or submit attempted', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('externalIp', ''));

    expect(result.current.errors.externalIp).toBeNull();
  });

  it('reports the required error once the field is touched and emptied', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('displayName', ''));
    act(() => result.current.touchField('displayName'));

    expect(result.current.errors.displayName).toBe('edit.field.name.error');
  });

  it('reports the IP error once submit has been attempted', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('externalIp', 'not-an-ip'));
    act(() => result.current.setSubmitAttempted(true));

    expect(result.current.errors.externalIp).toBe('edit.field.public_ip.error');
  });

  it('is invalid while any field is invalid, valid once every field is filled', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    expect(result.current.isValid).toBe(true);
    expect(result.current.firstInvalidStepId).toBeNull();

    act(() => result.current.setField('externalIp', ''));

    expect(result.current.isValid).toBe(false);
    expect(result.current.firstInvalidStepId).toBe('server');
  });

  it('lists no change right after seeding', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    expect(result.current.changes).toEqual([]);
    expect(result.current.isLicenseChanged).toBe(false);
  });

  it('lists a modified field in the recap', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('displayName', 'new-name'));

    expect(result.current.changes).toEqual([
      { field: 'displayName', before: 'VBR-CUST-SERV-01', after: 'new-name' },
    ]);
  });

  it('compares the license selection to the installed one, not the requested one', () => {
    const server = buildServer({
      licenseType: LicenseApiValue.VDP_ADVANCED,
      licenseTypeRequested: LicenseApiValue.VDP_PREMIUM,
    });
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.selectTier(VdpTier.PREMIUM));

    // Sélectionner de nouveau la valeur déjà demandée reste un changement par rapport à
    // l'installée : ce n'est pas un no-op.
    expect(result.current.isLicenseChanged).toBe(true);
    expect(result.current.changes).toContainEqual({
      field: 'licenseType',
      before: LicenseApiValue.VDP_ADVANCED,
      after: LicenseApiValue.VDP_PREMIUM,
    });
  });

  it('removes the field from the recap when the value is set back to the installed one', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.setField('displayName', 'new-name'));
    expect(result.current.changes).toHaveLength(1);

    act(() => result.current.setField('displayName', 'VBR-CUST-SERV-01'));
    expect(result.current.changes).toEqual([]);
  });

  it('selecting Enterprise Plus clears the VDP tier', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));

    expect(result.current.tier).toBeNull();
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.ENTERPRISE_PLUS);
  });

  it('switching back to Data Platform restores the previously selected tier', () => {
    const { result } = renderHook(() => useEditBackupServerForm(buildServer()));

    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));

    expect(result.current.tier).toBe(VdpTier.PREMIUM);
  });
});
