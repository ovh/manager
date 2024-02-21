import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import {
  filterUsers,
  getAllUsers,
  getUser,
  paginateResults,
  removeUser,
  UsersOptions,
} from '@/data/user';
import { downloadRCloneConfig } from '@/data/region';
import {
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  RCLONE_SERVICE_TYPE,
} from '@/download-rclone.constants';

type RemoveUserProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAllUsers = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'users'],
    queryFn: () => getAllUsers(projectId),
    retry: false,
  });
};

export const useUsers = (
  projectId: string,
  { pagination, sorting }: UsersOptions,
  searchQueries: string[],
) => {
  // retrieve All users from API
  const { data: users, error, isLoading } = useAllUsers(projectId);

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(
        filterUsers(users || [], sorting, searchQueries),
        pagination,
      ),
    };
  }, [users, sorting, searchQueries]);
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
    onSuccess,
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
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
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
