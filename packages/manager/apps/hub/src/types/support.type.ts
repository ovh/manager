import { ApiEnvelope } from '@/types/apiEnvelope.type';

export type Ticket = {
  serviceName: string;
  state: string;
  subject: string;
  ticketId: string;
};

export type SupportDataResponse = {
  count: number;
  data: Ticket[];
};

export type SupportResponse = {
  support: ApiEnvelope<SupportDataResponse>;
};

export type SupportConversationState =
  | 'awaiting-info'
  | 'cancelled'
  | 'closed'
  | 'new'
  | 'open'
  | 'resolved';

export type SupportConversationTicket = {
  number: string;
  priority?: number;
};

/** Item returned by apiv6 `GET /support/conversation` (narrowed to what we use). */
export type SupportConversation = {
  id: string;
  name: string;
  createdOn: string;
  modifiedOn: string;
  state: SupportConversationState;
  type: string;
  ticket: SupportConversationTicket | null;
};

/**
 * Normalized row rendered by the support tile, whatever the source: 2api
 * `/hub/support` or apiv6 `/support/conversation` for the Digital Agent.
 */
export type SupportTicketRow = {
  /** React key: conversation id or case number depending on the source. */
  key: string;
  /** First column: service name (`/hub/support`) or #case number (conversations). */
  label: string;
  subject: string;
  /** One of the `hub_support_state_*` translation suffixes. */
  state: string;
  /** Case number, for the Help Center and V6 links. Always set by both sources. */
  ticketId: string;
  /** Conversation id, for the Digital Agent link. */
  conversationId?: string;
};
