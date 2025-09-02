import { CurrentAccountStatus, ResourceStatus, TaskStatus, ZimbraOffer } from '@/data/api';

export type AccountType = {
  checksum: string;
  currentState: {
    contactInformation: {
      city: string;
      company: string;
      country: string;
      faxNumber: string;
      mobileNumber: string;
      office: string;
      phoneNumber: string;
      postcode: string;
      profession: string;
      service: string;
      street: string;
    };
    createdAt: string;
    description: string;
    detailedStatus: {
      details: string;
      link: string;
      status: keyof typeof CurrentAccountStatus;
    }[];
    displayName: string;
    domainId: string;
    email: string;
    firstName: string;
    hideInGal: boolean;
    lastConnectionAt: string;
    lastName: string;
    organizationId: string;
    organizationLabel: string;
    offer: keyof typeof ZimbraOffer;
    quota: {
      available: number;
      used: number;
    };
    updatedAt: string;
    slotId: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: keyof typeof TaskStatus;
    type: string;
  }[];
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: {
    contactInformation: {
      city: string;
      company: string;
      country: string;
      faxNumber: string;
      mobileNumber: string;
      office: string;
      phoneNumber: string;
      postcode: string;
      profession: string;
      service: string;
      street: string;
    };
    description: string;
    displayName: string;
    email: string;
    firstName: string;
    hideInGal: boolean;
    lastName: string;
    quota: {
      available: number;
      used: number;
    };
  };
};

export type AccountBodyParamsType = {
  contactInformation?: {
    city?: string;
    company?: string;
    country?: string;
    faxNumber?: string;
    mobileNumber?: string;
    office?: string;
    phoneNumber?: string;
    postcode?: string;
    profession?: string;
    service?: string;
    street?: string;
  };
  description?: string;
  displayName?: string;
  email: string;
  firstName?: string;
  forceChangePasswordAfterLogin?: boolean;
  hideInGal?: boolean;
  lastName?: string;
  password?: string;
  responder?: string;
  offer?: string;
  slotId?: string;
};
