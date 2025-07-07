import { ResourceStatus, SlotService } from '@/data/api';

export type EmailAccountItem = {
  id: string;
  email: string;
  offer: string;
  organizationId: string;
  organizationLabel: string;
  used: number;
  available: number;
  status: keyof typeof ResourceStatus;
  slotId: string;
  service?: SlotService;
};
