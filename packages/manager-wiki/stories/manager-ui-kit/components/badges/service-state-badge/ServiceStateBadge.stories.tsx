import React from 'react';
import { Meta } from '@storybook/react';
import { ServiceStateBadge, ResourceStatus } from '@ovh-ux/muk';

export const ServiceStateBadgeActive = () => (
  <ServiceStateBadge state="active" />
);
ServiceStateBadgeActive.parameters = {
  docs: {
    source: {
      code: `<ServiceStateBadge state="active" />`,
    },
  },
};

export const ServiceStateBadgeDeleted = () => (
  <ServiceStateBadge state="deleted" />
);
ServiceStateBadgeDeleted.parameters = {
  docs: {
    source: {
      code: `<ServiceStateBadge state="deleted" />`,
    },
  },
};

export const ServiceStateBadgeSuspended = () => (
  <ServiceStateBadge state="suspended" />
);
ServiceStateBadgeSuspended.parameters = {
  docs: {
    source: {
      code: `<ServiceStateBadge state="suspended" />`,
    },
  },
};

export const ServiceStateBadgeToActivate = () => (
  <ServiceStateBadge state="toActivate" />
);

export const ServiceStateBadgeToDelete = () => (
  <ServiceStateBadge state="toDelete" />
);

export const ServiceStateBadgeToSuspend = () => (
  <ServiceStateBadge state="toSuspend" />
);

export const ServiceStateBadgeUnknown = () => (
  <ServiceStateBadge state={('unknown' as unknown) as ResourceStatus} />
);

export const LoadingBadge = () => (
  <ServiceStateBadge
    isLoading
    state={('unknown' as unknown) as ResourceStatus}
  />
);
LoadingBadge.parameters = {
  docs: {
    source: {
      code: `<ServiceStateBadge 
  isLoading={true}
  state="unknown" 
/>`,
    },
  },
};

const meta: Meta<typeof ServiceStateBadge> = {
  title: 'Manager UI Kit/Components/Badges/ServiceStateBadge',
  component: ServiceStateBadge,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: [
        'active',
        'deleted',
        'suspended',
        'toActivate',
        'toDelete',
        'toSuspend',
        'unknown',
      ],
      description: 'Select the state of the service.',
    },
  },
  args: {
    state: 'active',
  },
  decorators: [],
};

export default meta;
