import React from 'react';

export const AssociateGitPage = React.lazy(
  () => import('@/pages/dashboard/multisite/git/AssociateGit.page'),
);

export const ConfigureGitPage = React.lazy(
  () => import('@/pages/dashboard/multisite/git/ConfigureGIt.page'),
);

export const DeleteGitModal = React.lazy(
  () => import('@/pages/dashboard/multisite/git/DeleteGit.modal'),
);

export const DeployeGitModal = React.lazy(
  () => import('@/pages/dashboard/multisite/git/DeployeGIt.modal'),
);

export const LastDeploymentGitModal = React.lazy(
  () => import('@/pages/dashboard/multisite/git/LastDeploymentGit.modal'),
);
