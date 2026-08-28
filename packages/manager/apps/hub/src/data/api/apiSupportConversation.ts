import { v6 } from '@ovh-ux/manager-core-api';

import { SupportConversation, SupportConversationState } from '@/types/support.type';

/**
 * `/hub/support` only exposes the ServiceNow case number (CSxxxxx) while the
 * Digital Agent is addressed by conversation id, so the conversations have to
 * be resolved separately. Same call as the V7 dashboard.
 */

/** Open states only — mirrors the tickets `/hub/support` returns. */
export const SUPPORT_CONVERSATION_OPEN_STATES: SupportConversationState[] = [
  'new',
  'open',
  'awaiting-info',
];

export const SUPPORT_CONVERSATION_PAGE_SIZE = 4;

/**
 * Repeated `state` params (`state=new&state=open&…`), so URLSearchParams is
 * built by hand: axios would serialize an array as `state[]=new`.
 */
const buildSupportConversationParams = (): URLSearchParams => {
  const params = new URLSearchParams();
  // exclude drafts / conversations without a ticket
  params.set('ticketCreated', 'true');
  // exclude alerts
  params.set('type', 'standard');
  SUPPORT_CONVERSATION_OPEN_STATES.forEach((state) => params.append('state', state));
  params.set('sort', 'modified-on-desc');
  return params;
};

export const getSupportConversations = async (): Promise<SupportConversation[]> => {
  const { data } = await v6.get<SupportConversation[]>('/support/conversation', {
    params: buildSupportConversationParams(),
    headers: {
      'X-Pagination-Size': `${SUPPORT_CONVERSATION_PAGE_SIZE}`,
      'X-Pagination-Cursor': '1',
    },
  });
  return data;
};
