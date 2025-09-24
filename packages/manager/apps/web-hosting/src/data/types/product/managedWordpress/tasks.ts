import { Status } from '../ssl';

export type PostImportTaskPayload = {
  'import.cmsSpecific.wordpress.selection': {
    plugins: { name: string; version: string; enabled: boolean }[];
    themes: { name: string; version: string; active: boolean }[];
    wholeDatabase: boolean;
    media: boolean;
    posts: boolean;
    pages: boolean;
    comments: boolean;
    tags: boolean;
    users: boolean;
  };
};

export type ManagedWordpressResourceTask = {
  createdAt: string;
  errors: Array<{
    message: string;
  }>;
  finishedAt?: string;
  id: string;
  link: string;
  message: string;
  progress: Array<{
    name: string;
    status: Status;
  }>;
  startedAt: string | null;
  status: Status;
  type: string;
  updatedAt: string;
};
