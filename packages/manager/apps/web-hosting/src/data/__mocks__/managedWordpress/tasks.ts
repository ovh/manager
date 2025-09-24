import { ManagedWordpressResourceTask } from '@/data/types/product/managedWordpress/tasks';
import { Status } from '@/data/types/product/ssl';

export const managedWordpressWebsitesTaskMock: ManagedWordpressResourceTask = {
  id: '0e9114ac-5a58-4b2d-894a-4b1b5fe67077',
  link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844',
  status: Status.RUNNING,
  type: 'SERVICE_CDN_FLUSH',
  createdAt: '2025-07-01T08:00:00+02:00',
  startedAt: '2025-07-01T08:01:00+02:00',
  updatedAt: '2025-07-01T08:01:01+02:00',
  message: '',
  progress: [],
  errors: [],
};
