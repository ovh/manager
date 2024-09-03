import { Contract } from '@/types/cloud/project/ai/partner/Contract';

/** Representation of a partner */
export interface Partner {
  /** Partner contract with logged in user's tenant */
  contract?: Contract;
  /** Partner creation date */
  createdAt?: string;
  /** Partner Description */
  description?: string;
  /** Partner Id */
  id?: string;
  /** Partner Name */
  name?: string;
}
