import { ResourceStatus } from '@/data/api';

export type AutoReplyItem = {
  id: string;
  name: string;
  from: string;
  until: string;
  copyTo: string;
  status: keyof typeof ResourceStatus;
};
