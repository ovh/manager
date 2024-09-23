import { vi } from 'vitest';

const mockPlugins = vi.hoisted(() => ({
  environment: {
    getEnvironment: () => ({
      getRegion: vi.fn(() => 'EU'),
      getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
    }),
  },
  navigation: {
    getURL: vi.fn(
      (app, hash) => `https://www.ovh.com/manager/#/${hash.replace('#', app)}`,
    ),
    navigateTo: vi.fn((app, hash) => {})
  },
  tracking: {
    trackClick: vi.fn(),
  },
  ux: {
    openLiveChat: vi.fn(),
  },
}));

const mockShell = vi.hoisted(() => ({
  shell: {
    getPlugin: (plugin: string) => {
      return mockPlugins[plugin as keyof typeof mockPlugins]
    },
  },
}));

export { mockPlugins, mockShell };
