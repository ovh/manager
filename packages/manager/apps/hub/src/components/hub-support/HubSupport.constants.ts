/** Rows displayed when the tile is fed by 2api `/hub/support`. */
export const MAX_TICKETS_TO_DISPLAY = 2;

/** Rows displayed when it is fed by the Digital Agent: matches X-Pagination-Size. */
export const MAX_DIGITAL_AGENT_TICKETS_TO_DISPLAY = 4;

export const SUPPORT_URLS = {
  allTickets:
    'https://help.ovhcloud.com/csm?id=csm_cases_requests&spa=1&table=sn_customerservice_case&filter=active%3Dtrue&p=1&o=sys_updated_on&d=desc&ovhSubsidiary=',
  viewTicket:
    'https://help.ovhcloud.com/csm?id=csm_ticket&table=sn_customerservice_case&number=CS{ticketId}&view=csp&ovhSubsidiary=',
};

/**
 * Digital Agent (Manager V7, served under /beta/ on the same origin).
 * `{conversationId}` is the `/support/conversation` id, not the CSxxxxx number.
 */
export const DIGITAL_AGENT_URLS = {
  allTickets: '/beta/#/support/tickets?type=ticket',
  viewTicket: '/beta/#/support/digital-agent/{conversationId}',
};
