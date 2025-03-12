import { ApiEnvelope } from '@/types/apiEnvelope.type';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export type Notification = {
  data: any;
  date: string;
  description: string;
  id: string;
  level: NotificationType;
  status: string;
  subject: string;
};

export type NotificationsList = {
  notifications: ApiEnvelope<Notification[]>;
};
