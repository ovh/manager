import { DomainEnum } from '@/alldoms/enum/domain';

export interface TDomain {
  canAccelerate: boolean;
  canCancel: boolean;
  canRelaunch: boolean;
  comment: string | null;
  creationDate: string | null;
  domain: string | null;
  doneDate: string | null;
  function: string | null;
  id: number;
  lastUpdate: string | null;
  status: DomainEnum;
  todoDate: string;
}
