export enum ReplyToChoices {
  LIST = 'list',
  SENDER = 'sender',
  MAILBOX = 'another_mailbox',
}

export enum ModerationChoices {
  ALL = 'all',
  SUBSONLY = 'subs_only',
  NONE = 'none',
}

export type MailingListType = {
  id: string;
  resourceStatus: string;
  checksum: string;
  targetSpec: {
    defaultReplyTo: ReplyToChoices;
    email: string;
    language: string;
    members: string[];
    moderationOption: ModerationChoices;
    organizationId: string;
    organizationLabel: string;
    owner: string;
  };
  currentState: {
    defaultReplyTo: ReplyToChoices;
    email: string;
    language: string;
    members: string[];
    moderationOption: ModerationChoices;
    organizationId: string;
    organizationLabel: string;
    owner: string;
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status: string;
    type: string;
  }>;
};

export type MailingListBodyParamsType = {
  defaultReplyTo?: ReplyToChoices;
  email?: string;
  language?: string;
  members?: string[];
  moderationOption?: ModerationChoices;
  organizationId?: string;
  owner?: string;
};
