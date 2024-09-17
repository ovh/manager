import { AccountType } from '../account';

export type MailingListType = {
  id: string;
  resourceStatus: string;
  checksum: string;
  targetSpec: {
    defaultReplyTo: string;
    email: string;
    language: string;
    members: string[];
    moderationOption: string;
    organizationId: string;
    organizationLabel: string;
    owner: AccountType;
  };
  currentState: {
    defaultReplyTo: string;
    email: string;
    language: string;
    members: string[];
    moderationOption: string;
    organizationId: string;
    organizationLabel: string;
    owner: AccountType;
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status: string;
    type: string;
  }>;
};
