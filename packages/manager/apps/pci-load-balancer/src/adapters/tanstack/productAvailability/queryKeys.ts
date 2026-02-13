export const productAvailabilityQueryKey = (projectId: string, ovhSubsidiary: string): string[] => [
  'project',
  projectId,
  'productAvailability',
  ovhSubsidiary,
];
