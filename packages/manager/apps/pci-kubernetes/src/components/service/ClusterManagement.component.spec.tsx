import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import ClusterManagement from '@/components/service/ClusterManagement.component';
import { wrapper } from '@/wrapperRenders';
import { DeploymentMode, TKube } from '@/types';
import * as useCloudModule from '@/api/hooks/useCloud';
import { TCloudSchema } from '@/api/data/cloud';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { TRegionInformations } from '@/types/region';

vi.mock('@/api/hooks/useRegionInformations', () => ({
  useRegionInformations: vi.fn(),
}));

describe('ClusterManagement', () => {
  beforeEach(() => {
    vi.mocked(useRegionInformations).mockReturnValue({
      data: { type: DeploymentMode.MONO_ZONE },
    } as UseQueryResult<TRegionInformations, Error>);
  });
  it('renders manage title with correct text', () => {
    const { getByText } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByText(/kube_service_manage_title/i)).toBeInTheDocument();
  });

  it('disables edit button when status is processing', () => {
    const { getByTestId } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'INSTALLING', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByTestId('clusterManagement-edit')).toBeDisabled();
  });

  it('enables edit button when status is not processing', () => {
    const { getByTestId } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByTestId('clusterManagement-edit')).not.toBeDisabled();
  });

  it('renders update button when cluster is not up to date', () => {
    const { getByText } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: false } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByText(/kube_service_common_update/i)).toBeInTheDocument();
  });

  it('does not render update button when cluster is up to date', () => {
    const { queryByText } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(queryByText(/kube_service_common_update/i)).toBeNull();
  });

  it('renders minor version upgrade button when cluster version is not the highest', () => {
    const { getByText } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(
      getByText(/kube_service_minor_version_upgrade/i),
    ).toBeInTheDocument();
  });

  it('does not render minor version upgrade button when cluster version is the highest', () => {
    vi.spyOn(useCloudModule, 'useGetCloudSchema').mockReturnValue({
      data: {
        models: {
          'cloud.kube.VersionEnum': {
            enum: ['1.18', '1.19', '1.20'],
          },
        },
      },
    } as UseQueryResult<TCloudSchema>);
    const { queryByText } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.20', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(queryByText(/kube_service_minor_version_upgrade/i)).toBeNull();
  });

  it('disables terminate button when status is processing', () => {
    const { getByTestId } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'INSTALLING', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByTestId('clusterManagement-terminate')).toBeDisabled();
  });

  it('enables terminate button when status is not processing', () => {
    const { getByTestId } = render(
      <ClusterManagement
        kubeDetail={
          { status: 'READY', version: '1.18', isUpToDate: true } as TKube
        }
      />,
      { wrapper },
    );
    expect(getByTestId('clusterManagement-terminate')).not.toBeDisabled();
  });
});
