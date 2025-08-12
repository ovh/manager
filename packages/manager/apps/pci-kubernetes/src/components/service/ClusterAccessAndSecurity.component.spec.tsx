import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import ClusterAccessAndSecurity from '@/components/service/ClusterAccessAndSecurity.component';
import { wrapper } from '@/wrapperRenders';
import { TKube, TOidcProvider } from '@/types';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';

describe('ClusterAccessAndSecurity', () => {
  it('renders access and security title with correct text', () => {
    const { getByText } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );
    expect(getByText('kube_service_access_security')).toBeInTheDocument();
  });

  it('renders kube API URL with clipboard component', () => {
    const { container } = render(
      <ClusterAccessAndSecurity
        kubeDetail={{ url: 'http://api.url' } as TKube}
      />,
      { wrapper },
    );

    const clipboardElement = container.querySelector(
      '[value="http://api.url"]',
    );
    expect(clipboardElement).toBeVisible();
  });

  it('renders restrictions count correctly when no restrictions', () => {
    vi.spyOn(useKubernetesModule, 'useClusterRestrictions').mockReturnValue({
      isPending: false,
      data: [],
    } as UseQueryResult<[]>);

    const { getByText } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );

    expect(
      getByText(/kube_service_restrictions_no_count/i),
    ).toBeInTheDocument();
  });

  it('renders restrictions count correctly when one restriction', () => {
    vi.spyOn(useKubernetesModule, 'useClusterRestrictions').mockReturnValue({
      isPending: false,
      data: ['restriction'],
    } as UseQueryResult<string[]>);

    const { getByText } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );
    expect(getByText(/kube_service_restrictions_one/i)).toBeInTheDocument();
  });

  it('renders restrictions count correctly when multiple restrictions', () => {
    vi.spyOn(useKubernetesModule, 'useClusterRestrictions').mockReturnValue({
      isPending: false,
      data: ['restriction', 'restriction'],
    } as UseQueryResult<string[]>);

    const { getByText } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );

    expect(getByText(/kube_service_restrictions_count/i)).toBeInTheDocument();
  });

  it('renders OIDC provider information correctly when defined', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      data: {
        clientId: 'client-id-oidc',
        issuerUrl: 'http://issuer.url',
      },
      isPending: false,
    } as UseQueryResult<TOidcProvider>);

    const { container } = render(
      <ClusterAccessAndSecurity
        kubeDetail={{ status: 'READY', url: 'kube.url' } as TKube}
      />,
      { wrapper },
    );

    const clipboardElement = container.querySelector('[value="kube.url"]');
    expect(clipboardElement).toBeVisible();
  });

  it('renders OIDC provider information correctly when not defined', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      data: {
        clientId: 'client-id-oidc',
      },
      isPending: false,
    } as UseQueryResult<TOidcProvider>);
    const { getByText } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );
    expect(
      getByText(/kube_service_access_security_oidc_no_provider/i),
    ).toBeInTheDocument();
  });

  it('renders upgrade policy correctly', () => {
    const { getByText } = render(
      <ClusterAccessAndSecurity
        kubeDetail={{ updatePolicy: 'automatic' } as TKube}
      />,
      { wrapper },
    );
    expect(
      getByText(/kube_service_upgrade_policy_automatic/i),
    ).toBeInTheDocument();
  });

  it('disables kube config button when status is installing', () => {
    const { getByTestId } = render(
      <ClusterAccessAndSecurity
        kubeDetail={{ status: 'INSTALLING' } as TKube}
      />,
      { wrapper },
    );
    expect(
      getByTestId('ClusterAccessAndSecurity-DownloadKubeConfig'),
    ).toBeDisabled();
  });

  it('enables kube config button when status is ready', () => {
    const { getByTestId } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );
    expect(
      getByTestId('ClusterAccessAndSecurity-DownloadKubeConfig'),
    ).not.toBeDisabled();
  });

  it('enables spinner for kube config button when getting data and button disabled', () => {
    vi.spyOn(useKubernetesModule, 'useKubeConfig').mockReturnValue({
      isPending: true,
    } as never);
    const { getByTestId } = render(
      <ClusterAccessAndSecurity kubeDetail={{ status: 'READY' } as TKube} />,
      { wrapper },
    );
    expect(
      getByTestId('clusterAccessAndSecurity-spinnerKubeConfig'),
    ).toBeInTheDocument();
    expect(
      getByTestId('ClusterAccessAndSecurity-DownloadKubeConfig'),
    ).toBeDisabled();
  });

  it('renders nodes URL with clipboard component', () => {
    const { container } = render(
      <ClusterAccessAndSecurity
        kubeDetail={{ status: 'READY', nodesUrl: 'http://nodes.url' } as TKube}
      />,
      { wrapper },
    );
    const clipboardElement = container.querySelector(
      '[value="http://nodes.url"]',
    );
    expect(clipboardElement).toBeVisible();
  });
});
