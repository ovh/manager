import '@/common/setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

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

const addSuccess = vi.fn();
const addError = vi.fn();
const clearNotifications = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');

  type DrawerProps = {
    isOpen: boolean;
    heading: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
    children?: React.ReactNode;
  };

  return {
    ...actual,
    Drawer: ({
      isOpen,
      heading,
      primaryButtonLabel,
      secondaryButtonLabel,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      children,
    }: DrawerProps) =>
      isOpen ? (
        <div data-testid="drawer">
          <h1>{heading}</h1>
          <button onClick={onSecondaryButtonClick}>
            {secondaryButtonLabel}
          </button>
          <button onClick={onPrimaryButtonClick}>{primaryButtonLabel}</button>
          {children}
        </div>
      ) : null,
    useNotifications: () => ({
      addSuccess,
      addError,
      clearNotifications,
    }),
  };
});

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
    expect(addSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_drawer_add_success',
    );
    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
    expect(resetError).toHaveBeenCalled();

    callbacks.onSettled();
    expect(clearNotifications).toHaveBeenCalled();
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

    const keyTagInput = screen.getByPlaceholderText('32456');
    const publicKeyTextarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    expect(keyTagInput).toHaveValue(dsRecordsData.keyTag);
    expect(publicKeyTextarea).toHaveValue(dsRecordsData.publicKey);

    fireEvent.change(keyTagInput, { target: { value: '60000' } });
    fireEvent.change(publicKeyTextarea, {
      target: { value: 'updatedPublicKey' },
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
    expect(addSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_drawer_modify_success',
    );
    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
    expect(resetError).toHaveBeenCalled();

    callbacks.onSettled();
    expect(clearNotifications).toHaveBeenCalled();
  });
});
