import { CurrentAccountStatus, ResourceStatus, SlotService } from '@/data/api';

export type EmailAccountItem = {
  id: string;
  email: string;
  offer: string;
  organizationId: string;
  organizationLabel: string;
  used: number;
  available: number;
  status: keyof typeof ResourceStatus;
  detailedStatus: {
    details: string;
    link: string;
    status: keyof typeof CurrentAccountStatus;
  }[];
  slotId: string;
  service?: SlotService;
};
