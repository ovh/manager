import { useParams } from 'react-router-dom';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  getProject,
  getProjectAcl,
  getProjectQuota,
  getProjectServiceInfos,
  TProject,
  TProjectServiceInfos,
  TQuota,
} from '../data/project';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export const getProjectQuery = (projectId: string) => ({
  queryKey: ['project', projectId],
  queryFn: () => getProject(projectId),
});

export const useProject = (
  projectId?: string,
  options?: QueryOptions<TProject, ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();

  return useQuery({
    ...getProjectQuery(projectId || defaultProjectId),
    ...options,
  });
};

export const getProjectQuotaQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'quota'],
  queryFn: () => getProjectQuota(projectId),
});

export const useProjectQuota = (
  projectId?: string,
  filter?: {
    region: string;
  },
  options?: QueryOptions<TQuota[], ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();

  return useQuery({
    ...getProjectQuotaQuery(projectId || defaultProjectId),
    select: (data) =>
      filter ? data.filter((quota) => quota.region === filter.region) : data,
    ...options,
  });
};

export const getProjectAclQuery = (
  projectId: string,
  type: Parameters<typeof getProjectAcl>[1],
) => ({
  queryKey: ['project', projectId, 'acl'],
  queryFn: () => getProjectAcl(projectId, type),
});

export const useProjectAcl = (
  projectId: string,
  type: Parameters<typeof getProjectAcl>[1],
  options?: QueryOptions<string[], ResponseAPIError>,
) =>
  useQuery({
    ...getProjectAclQuery(projectId, type),
    ...options,
  });

export const getProjectServiceInfosQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'serviceInfos'],
  queryFn: () => getProjectServiceInfos(projectId),
});

export const useProjectServiceInfos = (
  projectId: string,
  options?: QueryOptions<TProjectServiceInfos, ResponseAPIError>,
) =>
  useQuery({
    ...getProjectServiceInfosQuery(projectId),
    ...options,
  });

export const useProjectRights = (projectId?: string) => {
  const context = useContext(ShellContext);
  const { nichandle } = context.environment?.getUser() || {};
  const { projectId: defaultProjectId } = useParams();
  const { data: acl, isPending: isAclPending } = useProjectAcl(
    projectId || defaultProjectId,
    'readWrite',
  );
  const {
    data: serviceInfos,
    isPending: isServiceInfosPending,
  } = useProjectServiceInfos(projectId || defaultProjectId);

  const isPending = isAclPending || isServiceInfosPending || !nichandle;
  const isAdmin = serviceInfos?.contactAdmin === nichandle;
  const hasReadWriteRights = isAdmin || acl?.some((nic) => nic === nichandle);

  return {
    isPending,
    isAdmin,
    hasReadWriteRights,
  };
};
