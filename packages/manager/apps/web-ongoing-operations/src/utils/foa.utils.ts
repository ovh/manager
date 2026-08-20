import {
  DomainOperationsEnum,
  foaEligibleOperationStatuses,
} from '@/constants';
import { TFoa, TOngoingOperations } from '@/types';

/**
 * A FOA is still pending while the holder has not answered it, ie while its
 * currentState carries no choice.
 */
export const isPendingFoa = (foa: TFoa): boolean => !foa.currentState?.choice;

/**
 * An operation may be validated by a designated agent only while it is a
 * change of registrant still running. The APIv6 status of the operation is
 * the authority here : a done, cancelled — or otherwise finished — trade can
 * no longer be answered, whatever the APIv2 task list carries for the domain.
 */
export const isFoaEligibleOperation = (
  operation?: Pick<TOngoingOperations, 'function' | 'status'> | null,
): boolean =>
  operation?.function === DomainOperationsEnum.DomainTrade &&
  foaEligibleOperationStatuses.includes(operation.status);
