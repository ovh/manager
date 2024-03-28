import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Filter } from '@ovh-ux/manager-core-api';
import { saveAs } from 'file-saver';
import queryClient from '@/queryClient';
import {
  createUser,
  downloadOpenStackConfig,
  downloadRCloneConfig,
  filterUsers,
  generateOpenStackToken,
  getAllUsers,
  getUser,
  getUserRoles,
  paginateResults,
  regeneratePassword,
  removeUser,
  UsersOptions,
} from '@/api/data/user';
import {
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  RCLONE_SERVICE_TYPE,
} from '@/download-rclone.constants';
import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from '@/download-openrc.constants';
import {
  GenerateOpenStackTokenReturnType,
  OpenStackTokenResponse,
  User,
} from '@/interface';

type RemoveUserProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAllUsers = (projectId: string, filters: Filter[] = []) => {
  return useQuery({
    queryKey: ['project', projectId, 'users', filters],
    queryFn: () => getAllUsers(projectId, filters),
    retry: false,
  });
};

export const useUserRoles = (projectId: string, userId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'users', 'roles'],
    queryFn: () => getUserRoles(projectId, userId),
    retry: false,
  });
};

export const useUsers = (
  projectId: string,
  { pagination, sorting }: UsersOptions,
  filters: Filter[] = [],
) => {
  // retrieve All users from API
  const { data: users, error, isLoading } = useAllUsers(projectId, filters);
  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(filterUsers(users || [], sorting), pagination),
    };
  }, [users, sorting, filters]);
};

export const useUser = (projectId: string, userId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'user', userId],
    queryFn: () => getUser(projectId, userId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useRemoveUser = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: RemoveUserProps) => {
  const mutation = useMutation({
    mutationFn: () => {
      return removeUser(projectId, userId);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'users'],
      });
      return onSuccess();
    },
  });

  return {
    remove: () => {
      return mutation.mutate();
    },
    ...mutation,
  };
};

type DownloadRCloneConfigProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: (content: string) => void;
};

const readFile = (data: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(data);
  });
};

export const useDownloadRCloneConfig = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: DownloadRCloneConfigProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const download = async (region: string, fileType: string) => {
    try {
      setIsLoading(true);
      const service =
        RCLONE_SERVICE_TYPE[fileType.toUpperCase()] || RCLONE_SERVICE_TYPE.S3;
      const { content } = await downloadRCloneConfig(
        projectId,
        userId,
        region,
        service,
      );
      const data = new Blob([content], { type: DOWNLOAD_RCLONE_FILETYPE });
      saveAs(data, DOWNLOAD_RCLONE_FILENAME);
      const file = await readFile(data);
      window.open(file as string, '_blank');
      onSuccess(file as string);
    } catch (e) {
      onError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    download,
  };
};

type DownloadOpenStackConfigProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: (content: string) => void;
};

export const useDownloadOpenStackConfig = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: DownloadOpenStackConfigProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const download = async (region: string, openApiVersion: number) => {
    try {
      setIsLoading(true);
      const { content } = await downloadOpenStackConfig(
        projectId,
        userId,
        region,
        openApiVersion,
      );
      const data = new Blob([content], { type: DOWNLOAD_TYPE });
      saveAs(data, DOWNLOAD_FILENAME);
      const file = await readFile(data);
      window.open(file as string, '_blank');
      onSuccess(file as string);
    } catch (e) {
      onError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    download,
  };
};

interface GenerateOpenStackTokenProps {
  projectId: string;
  userId: string;
  password: string;
  onError: (cause: Error) => void;
  onSuccess: (token: OpenStackTokenResponse) => void;
}

export const useGenerateOpenStackToken = ({
  projectId,
  userId,
  password,
  onError,
  onSuccess,
}: GenerateOpenStackTokenProps): GenerateOpenStackTokenReturnType => {
  const mutation = useMutation({
    mutationFn: () => generateOpenStackToken(projectId, userId, password),
    onError,
    onSuccess,
  });

  return {
    generate: () => {
      return mutation.mutate();
    },
    ...mutation,
  };
};

type RegenerateProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: (user: User) => void;
};
export const useRegeneratePassword = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: RegenerateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const regenerate = async () => {
    try {
      const user = await regeneratePassword(projectId, userId);
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'users'],
      });
      onSuccess(user);
    } catch (e) {
      onError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    regenerate,
  };
};

type CreateUserProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: (data: User) => void;
};
type NewUserData = {
  description: string;
  roles: string[];
};
export const useCreateUser = ({
  projectId,
  onError,
  onSuccess,
}: CreateUserProps) => {
  const mutation = useMutation({
    mutationFn: (userData: NewUserData) =>
      createUser(projectId, userData.description, userData.roles),
    onSuccess: async (data: User) => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'users'],
      });
      onSuccess(data);
    },
    onError,
  });

  return {
    create: (userData: NewUserData) => {
      return mutation.mutate(userData);
    },
    ...mutation,
  };
};
