import {vi} from 'vitest';

const mockPlugins = vi.hoisted(() => ({
  environment: {
    getEnvironment: () => {
      return {
        getRegion: vi.fn(() => 'EU'),
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
      };
    },
  },
  navigation: {
    getURL: vi.fn(
      (app, hash) => `https://www.ovh.com/manager/#/${hash.replace('#', app)}`,
    ),
  },
}));

const mockShell = vi.hoisted(() => ({
  shell: {
    getPlugin: (plugin: string) => {
      return plugin === 'navigation'
        ? mockPlugins.navigation
        : mockPlugins.environment;
    },
  },
}));

export {
  mockPlugins,
  mockShell
}