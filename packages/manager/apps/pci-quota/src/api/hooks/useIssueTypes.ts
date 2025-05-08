import { useMutation, useQuery } from '@tanstack/react-query';
import { getIssueTypes } from '@/api/data/issue';
import {
  TCreateTicketParam,
  TCreateTicketResponse,
  createTicket,
} from '../data/ticket';

export const useGetIssueTypes = (language: string) =>
  useQuery({
    queryKey: ['issueTypes', language],
    queryFn: () => getIssueTypes(language),
  });

export const useMutationCreateTicket = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: TCreateTicketResponse) => void;
  onError: (error: unknown) => void;
}) =>
  useMutation({
    mutationFn: (data: TCreateTicketParam) => createTicket(data),
    onSuccess,
    onError,
  });
