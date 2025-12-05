import '@/common/setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import DsRecordsDrawer from '@/domain/components/DsRecords/DsRecordsDrawer';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/utils/utils', () => ({
  getPublicKeyError: vi.fn(() => ''),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useUpdateDomainResource: vi.fn(),
}));

const addSuccess = vi.fn();
const addError = vi.fn();
const clearNotifications = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('@ovh-ux/manager-react-components');

  return {
    ...actual,
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

  const targetSpec = {
    ...serviceInfoDetail.targetSpec,
    dnssecConfiguration: serviceInfoDetail.currentState.dnssecConfiguration,
  } as any;

  const supportedAlgorithms =
    targetSpec.dnssecConfiguration.supportedAlgorithms;

  const baseProps = {
    drawer: { isOpen: true, action: 'add' } as any,
    targetSpec,
    serviceName: serviceInfoDetail.id,
    checksum: serviceInfoDetail.checksum,
    supportedAlgorithms,
    setDrawer,
  };

  const getPrimaryButton = () => {
    const drawer = screen.getByTestId('drawer');
    const button = drawer.querySelector(
      'ods-button[variant="default"]',
    ) as HTMLElement | null;

    if (!button) {
      throw new Error('Primary button not found');
    }

    return button;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateDomainResource).mockReturnValue({
      updateDomain,
      isUpdateDomainPending: false,
    } as any);
  });

  it('Display the drawer with good informations', () => {
    render(<DsRecordsDrawer {...baseProps} />);

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_dsrecords_drawer_add_title'),
    ).toBeInTheDocument();

    expect(screen.getByText(/error_required_fields$/)).toBeInTheDocument();
  });

  it('submit the form and call the useUpdateResource function', async () => {
    render(<DsRecordsDrawer {...baseProps} />);

    const keyTagInput = screen.getByPlaceholderText('32456');
    const publicKeyTextarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    fireEvent.change(keyTagInput, { target: { value: '12345' } });
    fireEvent.change(publicKeyTextarea, {
      target: { value: 'validPublicKey' },
    });

    const primaryButton = getPrimaryButton();

    await waitFor(() => {
      expect(primaryButton).not.toBeDisabled();
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
          onError: (e: unknown) => void;
          onSettled: () => void;
        },
      ],
    ];

    expect(payload.checksum).toBe(serviceInfoDetail.checksum);
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

    callbacks.onSettled();
    expect(clearNotifications).toHaveBeenCalled();
    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
  });

  it('if updateDomain fails, call error', async () => {
    render(<DsRecordsDrawer {...baseProps} />);

    const keyTagInput = screen.getByPlaceholderText('32456');
    const publicKeyTextarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    fireEvent.change(keyTagInput, { target: { value: '54321' } });
    fireEvent.change(publicKeyTextarea, {
      target: { value: 'anotherPublicKey' },
    });

    const primaryButton = getPrimaryButton();

    await waitFor(() => {
      expect(primaryButton).not.toBeDisabled();
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalledTimes(1);
    });

    const [[, callbacks]] = updateDomain.mock.calls as [
      [
        any,
        {
          onSuccess: () => void;
          onError: (e: Error) => void;
          onSettled: () => void;
        },
      ],
    ];

    callbacks.onError(new Error('Some error'));

    expect(addError).toHaveBeenCalledWith(
      'domain_tab_dsrecords_drawer_add_error',
    );
  });
});
