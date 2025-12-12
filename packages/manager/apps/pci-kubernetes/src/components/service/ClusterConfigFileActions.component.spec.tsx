import { render } from '@testing-library/react';
import userEvents from '@testing-library/user-event';

import * as KubeAPI from '@/api/data/kubernetes';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import { ClusterConfigFileActions } from './ClusterConfigFileActions.component';

it('disables download kubeconfig button when status is installing', () => {
  const { getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'INSTALLING' } as TKube} />,
    { wrapper },
  );
  expect(getByText('kube_service_download_kubeconfig')).toBeDisabled();
});

it('enables download kubeconfig button when status is ready', () => {
  const { getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );
  expect(getByText('kube_service_download_kubeconfig')).not.toBeDisabled();
});

it('enables spinner for download kubeconfig button when getting data, button disabled and hide copy spinner', async () => {
  vi.spyOn(KubeAPI, 'postKubeConfig').mockReturnValue(new Promise(() => {}));

  const { getByTestId, queryByTestId, getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );

  await userEvents.click(getByText('kube_service_download_kubeconfig'));

  expect(getByTestId('download-kubeconfig-spinner')).toBeVisible();
  expect(getByText('kube_service_download_kubeconfig')).toBeDisabled();
  expect(queryByTestId('clusterConfigFileActions-spinnerCopyKubeConfig')).not.toBeInTheDocument();
});

it('disables copy kubeconfig button when status is installing', () => {
  const { getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'INSTALLING' } as TKube} />,
    { wrapper },
  );
  expect(getByText('kube_service_copy_kubeconfig')).toBeDisabled();
});

it('enables copy kubeconfig button when status is ready', () => {
  const { getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );
  expect(getByText('kube_service_copy_kubeconfig')).not.toBeDisabled();
});

it('enables spinner for copy kubeconfig button when getting data, button disabled and hide download spinner', async () => {
  vi.spyOn(KubeAPI, 'postKubeConfig').mockReturnValue(new Promise(() => {}));

  const { getByTestId, queryByTestId, getByText } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );

  await userEvents.click(getByText('kube_service_copy_kubeconfig'));

  expect(getByTestId('copy-kubeconfig-spinner')).toBeVisible();
  expect(getByText('kube_service_copy_kubeconfig')).toBeDisabled();
  expect(
    queryByTestId('clusterConfigFileActions-spinnerDownloadKubeConfig'),
  ).not.toBeInTheDocument();
});
