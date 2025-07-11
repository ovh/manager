import { ResourceStatus } from '@/data/api';

export type MailingListItem = {
  id: string;
  name: string;
  organizationLabel: string;
  organizationId: string;
  owner: string;
  aliases: number;
  moderators: number;
  subscribers: number;
  status: keyof typeof ResourceStatus;
};
