export const queryKeys = {
  subscription: {
    active: () => ['backup-licenses', 'subscription', 'active'],
  },
  locations: {
    list: (language: string) => ['backup-licenses', 'locations', language],
  },
} as const;
