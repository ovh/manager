export type ContactStatus = 'SENT' | 'DROPPED' | 'QUEUED';
export type ContactType = 'EMAIL';
export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Notification = {
  attachments: Attachment[];
  categories: string[];
  contacts: Contact[];
  createdAt: string;
  html: string | null;
  id: string;
  priority: NotificationPriority;
  text: string | null;
  title: string;
};

export type Attachment = {
  contentType: string;
  name: string;
  sizeBytes: number;
  url?: string | null;
};

export type Contact = {
  error: string | null;
  id: string;
  sentAt: string;
  status: ContactStatus;
  to: string;
  type: ContactType;
};
