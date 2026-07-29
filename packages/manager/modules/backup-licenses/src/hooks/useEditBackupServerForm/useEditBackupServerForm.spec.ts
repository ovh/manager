import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BackupServerResource } from '@/types/BackupServer.type';
import { LicenseApiValue } from '@/types/Order.type';

import { useEditBackupServerForm } from './useEditBackupServerForm';

const server: BackupServerResource = {
  id: 'server-1',
  status: 'ENABLED',
  currentState: {
    id: 'server-1',
    displayName: 'VBR-CUST-SERV-01',
    licenseType: LicenseApiValue.VDP_PREMIUM,
    externalIps: ['203.0.113.10/32'],
    privateIps: ['192.168.10.2/32'],
  },
  currentTasks: [],
};

describe('useEditBackupServerForm', () => {
  it('is not seeded before the server is known', () => {
    const { result } = renderHook(() => useEditBackupServerForm(undefined));
    expect(result.current.form).toBeNull();
  });

  it('seeds the form from the current state, with IPs stripped of their host mask', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    expect(result.current.form).toEqual({
      displayName: 'VBR-CUST-SERV-01',
      licenseType: LicenseApiValue.VDP_PREMIUM,
      externalIp: '203.0.113.10',
      privateIp: '192.168.10.2',
    });
  });

  it('does not reseed the form once a later server update comes in, to keep the user input', () => {
    const { result, rerender } = renderHook(
      ({ srv }: { srv?: BackupServerResource }) => useEditBackupServerForm(srv),
      { initialProps: { srv: server } },
    );

    act(() => result.current.setField('displayName', 'edited-name'));

    rerender({
      srv: {
        ...server,
        currentState: { ...server.currentState, displayName: 'refetched-name' },
      },
    });

    expect(result.current.form?.displayName).toBe('edited-name');
  });

  it('shows no error before any interaction', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));
    expect(result.current.errors).toEqual({
      displayName: null,
      externalIp: null,
      privateIp: null,
    });
  });

  it('shows the required error for a field once it is touched and emptied', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('displayName', ''));
    act(() => result.current.touchField('displayName'));

    expect(result.current.errors.displayName).toBe('edit.field.name.error');
  });

  it('shows the IP format error as soon as an invalid value is entered, without waiting for touch', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('externalIp', '999.999.0.1'));

    expect(result.current.errors.externalIp).toBe('edit.field.public_ip.error');
  });

  it('shows every required error after a submit attempt', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('externalIp', ''));
    act(() => result.current.setField('privateIp', ''));
    act(() => result.current.setSubmitAttempted(true));

    expect(result.current.errors.externalIp).toBe('edit.field.public_ip.error');
    expect(result.current.errors.privateIp).toBe('edit.field.private_ip.error');
  });

  it('is valid once seeded from a server with valid data', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));
    expect(result.current.isValid).toBe(true);
  });

  it('is invalid while the form is not yet seeded', () => {
    const { result } = renderHook(() => useEditBackupServerForm(undefined));
    expect(result.current.isValid).toBe(false);
  });

  it('is invalid when an IP becomes malformed', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));
    act(() => result.current.setField('privateIp', 'not-an-ip'));
    expect(result.current.isValid).toBe(false);
  });

  it('lists no change right after seeding', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));
    expect(result.current.changes).toEqual([]);
  });

  it('lists only the fields that differ from the installed value', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('displayName', 'new-name'));

    expect(result.current.changes).toEqual([
      { field: 'displayName', before: 'VBR-CUST-SERV-01', after: 'new-name' },
    ]);
  });

  it('reports a license change against the installed licence, not a default value', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('licenseType', LicenseApiValue.VDP_ADVANCED));

    expect(result.current.changes).toEqual([
      {
        field: 'licenseType',
        before: LicenseApiValue.VDP_PREMIUM,
        after: LicenseApiValue.VDP_ADVANCED,
      },
    ]);
  });

  it('reverting a field back to its installed value clears it from the changes', () => {
    const { result } = renderHook(() => useEditBackupServerForm(server));

    act(() => result.current.setField('externalIp', '203.0.113.99'));
    expect(result.current.changes).toHaveLength(1);

    act(() => result.current.setField('externalIp', '203.0.113.10'));
    expect(result.current.changes).toEqual([]);
  });
});
