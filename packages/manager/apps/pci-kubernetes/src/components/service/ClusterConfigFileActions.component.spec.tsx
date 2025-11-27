import { render } from '@testing-library/react';
import userEvents from '@testing-library/user-event';

import * as KubeAPI from '@/api/data/kubernetes';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import { ClusterConfigFileActions } from './ClusterConfigFileActions.component';

it('disables download kubeconfig button when status is installing', () => {
  const { getByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'INSTALLING' } as TKube} />,
    { wrapper },
  );
  expect(getByTestId('ClusterConfigFileActions-DownloadKubeConfig')).toBeDisabled();
});

it('enables download kubeconfig button when status is ready', () => {
  const { getByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );
  expect(getByTestId('ClusterConfigFileActions-DownloadKubeConfig')).not.toBeDisabled();
});

it('enables spinner for download kubeconfig button when getting data, button disabled and hide copy spinner', async () => {
  vi.spyOn(KubeAPI, 'postKubeConfig').mockReturnValue(new Promise(() => {}));

  const { getByTestId, queryByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );

  await userEvents.click(getByTestId('ClusterConfigFileActions-DownloadKubeConfig'));

  expect(getByTestId('clusterConfigFileActions-spinnerDownloadKubeConfig')).toBeInTheDocument();
  expect(getByTestId('ClusterConfigFileActions-DownloadKubeConfig')).toBeDisabled();
  expect(queryByTestId('clusterConfigFileActions-spinnerCopyKubeConfig')).not.toBeInTheDocument();
});

it('disables copy kubeconfig button when status is installing', () => {
  const { getByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'INSTALLING' } as TKube} />,
    { wrapper },
  );
  expect(getByTestId('ClusterConfigFileActions-CopyKubeConfig')).toBeDisabled();
});

it('enables copy kubeconfig button when status is ready', () => {
  const { getByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );
  expect(getByTestId('ClusterConfigFileActions-CopyKubeConfig')).not.toBeDisabled();
});

it('enables spinner for copy kubeconfig button when getting data, button disabled and hide download spinner', async () => {
  vi.spyOn(KubeAPI, 'postKubeConfig').mockReturnValue(new Promise(() => {}));

  const { getByTestId, queryByTestId } = render(
    <ClusterConfigFileActions projectId="" kubeDetail={{ status: 'READY' } as TKube} />,
    { wrapper },
  );

  await userEvents.click(getByTestId('ClusterConfigFileActions-CopyKubeConfig'));

  expect(getByTestId('clusterConfigFileActions-spinnerCopyKubeConfig')).toBeInTheDocument();
  expect(getByTestId('ClusterConfigFileActions-CopyKubeConfig')).toBeDisabled();
  expect(
    queryByTestId('clusterConfigFileActions-spinnerDownloadKubeConfig'),
  ).not.toBeInTheDocument();
});
