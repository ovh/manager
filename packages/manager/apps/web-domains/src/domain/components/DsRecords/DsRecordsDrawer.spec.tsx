import '@/common/setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { mockAddSuccess, mockClearNotifications } from '@/common/setupTests';

import DsRecordsDrawer from '@/domain/components/DsRecords/DsRecordsDrawer';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import React from 'react';

vi.mock('@/domain/utils/utils', () => ({
  getPublicKeyError: vi.fn(() => ''),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useUpdateDomainResource: vi.fn(),
}));

describe('DsRecordsDrawer', () => {
  const updateDomain = vi.fn();
  const setDrawer = vi.fn();
  const resetError = vi.fn();

  const targetSpec = {
    ...serviceInfoDetail.targetSpec,
    dnssecConfiguration: serviceInfoDetail.currentState.dnssecConfiguration,
  } as any;

  const supportedAlgorithms =
    targetSpec.dnssecConfiguration.supportedAlgorithms;

  const dsRecordsData = targetSpec.dnssecConfiguration.dsData[0];

  const basePropsAdd = {
    drawer: { isOpen: true, action: DrawerActionEnum.Add },
    targetSpec,
    serviceName: serviceInfoDetail.id,
    checksum: serviceInfoDetail.checksum,
    supportedAlgorithms,
    dsRecordsData,
    setDrawer,
  } as const;

  const basePropsModify = {
    ...basePropsAdd,
    drawer: { isOpen: true, action: DrawerActionEnum.Modify },
  } as const;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateDomainResource).mockReturnValue({
      updateDomain,
      isUpdateDomainPending: false,
      errorMessage: null,
      resetError,
    } as any);
  });

  it('Display the drawer with good informations in Add mode', () => {
    render(<DsRecordsDrawer {...basePropsAdd} />);

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_dsrecords_drawer_add_title'),
    ).toBeInTheDocument();

    expect(screen.getByText(/error_required_fields$/)).toBeInTheDocument();
  });

  it('submit the form and call useUpdateDomainResource in Add mode', async () => {
    render(<DsRecordsDrawer {...basePropsAdd} />);

    const keyTagInput = screen.getByPlaceholderText('32456');
    const publicKeyTextarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    fireEvent.change(keyTagInput, { target: { value: '12345' } });
    fireEvent.change(publicKeyTextarea, {
      target: { value: 'validPublicKey' },
    });

    await waitFor(() => {
      const primaryButton = screen.getByRole('button', {
        name: /actions:validate/i,
      });
      expect(primaryButton).not.toBeDisabled();
    });

    const primaryButton = screen.getByRole('button', {
      name: /actions:validate/i,
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalledTimes(1);
    });

    const [[payload, callbacks]] = updateDomain.mock.calls as [
      [
        {
          checksum: string;
          currentTargetSpec: unknown;
          updatedSpec: {
            dnssecConfiguration: { dsData: unknown[] };
          };
        },
        {
          onSuccess: () => void;
          onSettled: () => void;
        },
      ],
    ];

    expect(payload.currentTargetSpec).toEqual(targetSpec);

    const { dsData } = payload.updatedSpec.dnssecConfiguration;

    expect(dsData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyTag: 12345,
          flags: 257,
          algorithm: supportedAlgorithms[0].number,
          publicKey: 'validPublicKey',
        }),
      ]),
    );

    callbacks.onSuccess();
    expect(mockAddSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_drawer_add_success',
    );
    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
    expect(resetError).toHaveBeenCalled();

    callbacks.onSettled();
    expect(mockClearNotifications).toHaveBeenCalled();
  });

  it('display an error message when errorMessage is defined', () => {
    vi.mocked(useUpdateDomainResource).mockReturnValue({
      updateDomain,
      isUpdateDomainPending: false,
      errorMessage: {
        response: { data: { message: 'Some error' } },
      },
      resetError,
    } as any);

    render(<DsRecordsDrawer {...basePropsAdd} />);

    expect(
      screen.getByText('domain_tab_dsrecords_drawer_add_error'),
    ).toBeInTheDocument();
  });

  it('prefills form and uses modify title in Modify mode', async () => {
    render(<DsRecordsDrawer {...basePropsModify} />);

    expect(
      screen.getByText('domain_tab_dsrecords_drawer_modify_title'),
    ).toBeInTheDocument();

    const keyTagInput = document.querySelector('input[name="keyTag"]') as HTMLInputElement;
    const publicKeyTextarea = document.querySelector('textarea[name="publicKey"]') as HTMLTextAreaElement;

    expect(keyTagInput).toBeInTheDocument();
    expect(publicKeyTextarea).toBeInTheDocument();

    await waitFor(
      () => {
        expect(keyTagInput.value).toBe(String(dsRecordsData.keyTag));
      },
      { timeout: 3000 },
    );
    await waitFor(
      () => {
        expect(publicKeyTextarea.value).toBe(dsRecordsData.publicKey);
      },
      { timeout: 3000 },
    );

    fireEvent.change(keyTagInput, { target: { value: '60000' } });
    fireEvent.change(publicKeyTextarea, {
      target: { value: 'updatedPublicKey' },
    });

    await waitFor(() => {
      const primaryButton = screen.getByRole('button', {
        name: /actions:validate/i,
      });
      expect(primaryButton).not.toBeDisabled();
    });

    const primaryButton = screen.getByRole('button', {
      name: /actions:validate/i,
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalledTimes(1);
    });

    const [[payload, callbacks]] = updateDomain.mock.calls as [
      [
        {
          checksum: string;
          currentTargetSpec: unknown;
          updatedSpec: {
            dnssecConfiguration: { dsData: any[] };
          };
        },
        {
          onSuccess: () => void;
          onSettled: () => void;
        },
      ],
    ];

    const { dsData } = payload.updatedSpec.dnssecConfiguration;

    expect(dsData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyTag: 60000,
          flags: 257,
          algorithm: dsRecordsData.algorithm,
          publicKey: 'updatedPublicKey',
        }),
      ]),
    );

    callbacks.onSuccess();
    expect(mockAddSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_drawer_modify_success',
    );
    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
    expect(resetError).toHaveBeenCalled();

    callbacks.onSettled();
    expect(mockClearNotifications).toHaveBeenCalled();
  });
});
