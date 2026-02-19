import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useGetProject } from '@/hooks/useGetProject';
import { CreateShareForm } from '@/pages/create/components/form/CreateShareForm.component';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import { useShareCreation } from '@/pages/create/hooks/useShareCreation';
import {
  TAvailabilityZoneData,
  TMicroRegionData,
  TShareSpecData,
} from '@/pages/create/view-model/shareCatalog.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');
vi.mock('@/pages/create/hooks/useShareCreation');

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  return {
    ...actual,
    useWatch: vi.fn().mockReturnValue(['GRA', 'GRA1', 'test-share']),
  };
});

const mockUseCreateShareForm = ({ isValid }: { isValid: boolean }) =>
  vi.mocked(useCreateShareForm).mockReturnValue({
    control: {},
    formState: { isValid },
    handleSubmit: vi.fn((onValid) => (e?: React.BaseSyntheticEvent) => {
      e?.preventDefault?.();
      if (isValid) {
        onValid({
          macroRegion: 'GRA',
          shareData: {
            name: 'test-share',
            microRegion: 'GRA1',
            specName: 'nfs',
            size: 150,
            privateNetworkId: undefined,
          },
          deploymentModes: [],
          continent: 'all',
          availabilityZone: null,
        });
      }
    }),
  } as unknown as ReturnType<
    typeof import('@/pages/create/hooks/useCreateShareForm').useCreateShareForm
  >);

vi.mock('@/pages/create/hooks/useCreateShareForm', () => ({
  useCreateShareForm: vi.fn(),
}));

vi.mock('@/hooks/useGetProject', () => ({
  useGetProject: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@/pages/create/components/name/NameInput.component', () => ({
  NameInput: () => <div data-testid="name-input">Name Input</div>,
}));

vi.mock(
  '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component',
  () => ({
    DeploymentModeSection: () => (
      <div data-testid="deployment-mode-section">Deployment Mode Section</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component',
  () => ({
    MacroRegionSelection: () => (
      <div data-testid="macro-region-selection">Macro Region Selection</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component',
  () => ({
    MicroRegionSelection: () => (
      <div data-testid="micro-region-selection">Micro Region Selection</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/availabilityZone/AvailabilityZoneSelection.component',
  () => ({
    AvailabilityZoneSelection: () => (
      <div data-testid="availability-zone-selection">Availability Zone Selection</div>
    ),
  }),
);

vi.mock('@/pages/create/components/share/ShareSelection.component', () => ({
  ShareSelection: () => <div data-testid="share-selection">Share Selection</div>,
}));

vi.mock('@/pages/create/components/share/ShareSizeSelection.component', () => ({
  ShareSizeSelection: () => <div data-testid="share-size-selection">Share Size Selection</div>,
}));

vi.mock('@/pages/create/components/network/PrivateNetworkSelection.component', () => ({
  PrivateNetworkSelection: () => (
    <div data-testid="private-network-selection">Private Network Selection</div>
  ),
}));

const { mockSuccessToast, mockWarningToast, mockToast } = vi.hoisted(() => ({
  mockSuccessToast: vi.fn(),
  mockWarningToast: vi.fn(),
  mockToast: vi.fn(),
}));

vi.mock('@/utils/toast.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/toast.utils')>();
  return {
    ...actual,
    successToast: mockSuccessToast,
    warningToast: mockWarningToast,
  };
});

vi.mock('@ovhcloud/ods-react', () => ({
  Divider: ({ className }: { className: string }) => (
    <div data-testid="divider" className={className} />
  ),
  Text: ({ children, preset }: PropsWithChildren<{ preset: string }>) => (
    <div data-testid={`text-${preset}`}>{children}</div>
  ),
  Button: ({
    children,
    onClick,
    type,
    disabled,
    variant,
  }: PropsWithChildren<{
    onClick?: () => void;
    type?: string;
    disabled?: boolean;
    variant?: string;
  }>) => (
    <button
      data-testid={`button-${variant || 'default'}`}
      type={type as 'button' | 'submit'}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

const mockUseShareCatalog = vi.mocked(useShareCatalog);
const mockUseShareCreation = vi.mocked(useShareCreation);
const mockUseGetProject = vi.mocked(useGetProject);

describe('CreateShareForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockSuccessToast.mockClear();
    mockWarningToast.mockClear();
    mockUseGetProject.mockReturnValue(undefined);
    mockUseCreateShareForm({ isValid: true });
    mockUseShareCreation.mockReturnValue({
      createShare: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useShareCreation>);
  });

  it('should render all form sections', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    renderWithMockedForm(<CreateShareForm />);

    expect(screen.getByTestId('name-input')).toBeVisible();
    expect(screen.getByTestId('deployment-mode-section')).toBeVisible();
    expect(screen.getByTestId('macro-region-selection')).toBeVisible();
    expect(screen.getByTestId('share-selection')).toBeVisible();
    expect(screen.getByTestId('share-size-selection')).toBeVisible();
    expect(screen.getByTestId('private-network-selection')).toBeVisible();
  });

  it.each([
    {
      description: 'should not render MicroRegionSelection when there are 0 micro regions',
      microRegionOptions: [],
      shouldRender: false,
    },
    {
      description: 'should not render MicroRegionSelection when there is 1 micro region',
      microRegionOptions: [{ label: 'GRA1', value: 'GRA1', disabled: false }],
      shouldRender: false,
    },
    {
      description: 'should not render MicroRegionSelection when microRegionOptions is undefined',
      microRegionOptions: undefined,
      shouldRender: false,
    },
    {
      description: 'should render MicroRegionSelection when there are more than 1 micro regions',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: false },
      ],
      shouldRender: true,
    },
  ])('MicroRegionSelection: $description', ({ microRegionOptions, shouldRender }) => {
    mockUseShareCatalog.mockReturnValue({
      data: microRegionOptions,
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

    renderWithMockedForm(<CreateShareForm />, {
      defaultValues: { macroRegion: 'GRA' },
    });

    if (shouldRender) {
      expect(screen.getByTestId('micro-region-selection')).toBeVisible();
    } else {
      expect(screen.queryByTestId('micro-region-selection')).not.toBeInTheDocument();
    }
  });

  it.each([
    {
      description:
        'should not render AvailabilityZoneSelection when there are 0 availability zones',
      microRegionOptions: [],
      availabilityZones: [],
      shouldRender: false,
    },
    {
      description:
        'should not render AvailabilityZoneSelection when availabilityZones is undefined',
      microRegionOptions: [],
      availabilityZones: undefined,
      shouldRender: false,
    },
    {
      description: 'should render AvailabilityZoneSelection when there are availability zones',
      microRegionOptions: [],
      availabilityZones: [
        { label: 'GRA1-A', value: 'GRA1-A' },
        { label: 'GRA1-B', value: 'GRA1-B' },
      ],
      shouldRender: true,
    },
  ])(
    'AvailabilityZoneSelection: $description',
    ({ microRegionOptions, availabilityZones, shouldRender }) => {
      mockUseShareCatalog
        .mockReturnValueOnce({
          data: microRegionOptions,
        } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>)
        .mockReturnValueOnce({
          data: availabilityZones,
        } as unknown as QueryObserverSuccessResult<TAvailabilityZoneData[]>);

      renderWithMockedForm(<CreateShareForm />, {
        defaultValues: { macroRegion: 'GRA', shareData: { microRegion: 'GRA1' } },
      });

      if (shouldRender) {
        expect(screen.getByTestId('availability-zone-selection')).toBeVisible();
      } else {
        expect(screen.queryByTestId('availability-zone-selection')).not.toBeInTheDocument();
      }
    },
  );

  it('should disable submit button when form is invalid', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    mockUseCreateShareForm({ isValid: false });

    renderWithMockedForm(<CreateShareForm />);

    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    renderWithMockedForm(<CreateShareForm />);

    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable submit button when project is discovery', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    mockUseGetProject.mockReturnValue({
      id: 'project-id',
      name: 'Discovery project',
      url: 'https://example.com',
      isDiscovery: true,
    } as ReturnType<typeof useGetProject>);

    renderWithMockedForm(<CreateShareForm />);

    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).toBeDisabled();
  });

  it('should call navigate on cancel button click', async () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    renderWithMockedForm(<CreateShareForm />);

    const cancelButton = screen.getByTestId('button-ghost');
    await userEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should display error toast when create share fails', async () => {
    const mockCreateShare = vi.fn();
    let onErrorCallback: ((errorMessage: string) => void) | undefined;

    mockUseShareCreation.mockImplementation((_, { onError }) => {
      onErrorCallback = onError;

      return {
        createShare: mockCreateShare,
        isPending: false,
      } as unknown as ReturnType<typeof useShareCreation>;
    });

    renderWithMockedForm(<CreateShareForm />, {
      defaultValues: {
        macroRegion: 'GRA',
        shareData: {
          name: 'test-share',
          microRegion: 'GRA1',
          specName: 'nfs',
          size: 150,
        },
      },
    });

    const submitButton = screen.getByText(/actions:validate$/);
    await userEvent.click(submitButton);

    if (onErrorCallback) onErrorCallback('Create share failed');

    expect(mockCreateShare).toHaveBeenCalled();
    expect(mockWarningToast).toHaveBeenCalledWith(
      expect.objectContaining({ duration: expect.any(Number) }),
    );
  });

  it('should navigate back when create share succeeds', async () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<
      TMicroRegionData[] | TAvailabilityZoneData[] | TShareSpecData[]
    >);

    const mockCreateShare = vi.fn();
    let onSuccessCallback: (() => void) | undefined;

    mockUseShareCreation.mockImplementation((_, { onSuccess }) => {
      onSuccessCallback = onSuccess;
      return {
        createShare: mockCreateShare,
        isPending: false,
      } as unknown as ReturnType<typeof useShareCreation>;
    });

    renderWithMockedForm(<CreateShareForm />, {
      defaultValues: {
        macroRegion: 'GRA',
        shareData: {
          name: 'test-share',
          microRegion: 'GRA1',
          specName: 'nfs',
          size: 150,
        },
      },
    });

    const submitButton = screen.getByText(/actions:validate$/);
    await userEvent.click(submitButton);

    if (onSuccessCallback) onSuccessCallback();
    expect(mockCreateShare).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('..');
    expect(mockSuccessToast).toHaveBeenCalledWith(
      expect.objectContaining({ duration: expect.any(Number) }),
    );
  });
});
