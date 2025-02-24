import { v6 } from '@ovh-ux/manager-core-api';

export type TCreateTicketParam = {
  issueTypeId: number;
  subject: string;
  body: string;
  serviceName?: string;
};

export type TCreateTicketResponse = {
  ticketId: string;
};

export const createTicket = async (
  newTicket: TCreateTicketParam,
): Promise<TCreateTicketResponse> => {
  const { data } = await v6.post<TCreateTicketResponse>(
    '/support/tickets',
    newTicket,
  );
  return data;
};
