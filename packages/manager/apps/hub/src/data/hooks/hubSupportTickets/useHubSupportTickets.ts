import { useContext, useMemo } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useFetchHubSupport } from '@/data/hooks/apiHubSupport/useHubSupport';
import { useSupportConversations } from '@/data/hooks/apiSupportConversation/useSupportConversations';
import { SupportConversation, SupportTicketRow, Ticket } from '@/types/support.type';
import { isDigitalAgentEnabled } from '@/utils/digitalAgent';

const toDigitalAgentRow = (conversation: SupportConversation): SupportTicketRow => ({
  key: conversation.id,
  label: `#${conversation.ticket.number}`,
  subject: conversation.name,
  // The query only asks for new / open / awaiting-info, all "open" in the V6
  // vocabulary, which has no translation for the finer conversation states.
  state: 'open',
  ticketId: conversation.ticket.number,
  conversationId: conversation.id,
});

const toHubSupportRow = (ticket: Ticket): SupportTicketRow => ({
  key: String(ticket.ticketId),
  label: ticket.serviceName,
  subject: ticket.subject,
  state: ticket.state,
  ticketId: String(ticket.ticketId),
});

/**
 * Feeds the support tile. FR customers on the EU manager are served by apiv6
 * `/support/conversation`, the same source as the V7 dashboard, so that every
 * row carries the conversation id the Digital Agent addresses tickets by.
 * Everyone else keeps 2api `/hub/support`.
 */
export const useHubSupportTickets = () => {
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();
  const { ovhSubsidiary } = environment.getUser();
  const isDigitalAgent = isDigitalAgentEnabled(region, ovhSubsidiary);

  const hubSupport = useFetchHubSupport({ enabled: !isDigitalAgent });
  const conversations = useSupportConversations({ enabled: isDigitalAgent });

  const tickets = useMemo<SupportTicketRow[]>(() => {
    if (isDigitalAgent) {
      // Defensive: ticketCreated=true should already exclude ticketless conversations.
      return (conversations.data ?? []).filter((c) => c.ticket).map(toDigitalAgentRow);
    }
    return (hubSupport.data?.data ?? []).map(toHubSupportRow);
  }, [isDigitalAgent, conversations.data, hubSupport.data]);

  const query = isDigitalAgent ? conversations : hubSupport;

  return {
    isDigitalAgent,
    tickets,
    // The conversation route is a plain array capped by X-Pagination-Size,
    // so the Digital Agent count is the page size, not the grand total.
    count: isDigitalAgent ? tickets.length : (hubSupport.data?.count ?? 0),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useHubSupportTickets;
