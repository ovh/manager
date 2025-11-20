import { vi } from 'vitest';
import { Locale } from '@/hooks/useLocale';
import { mockedUser } from './mocks/user';

export const mockManagerReactShellClient = () => {
  vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
    const mod = await importOriginal<
      typeof import('@ovh-ux/manager-react-shell-client')
    >();
    return {
      ...mod,
      useShell: vi.fn(() => ({
        i18n: {
          getLocale: vi.fn(() => Locale.fr_FR), // Retourne la locale en français
          onLocaleChange: vi.fn(), // Fonction mockée pour les changements de locale
          setLocale: vi.fn(), // Fonction mockée pour changer la locale
        },
        environment: {
          getEnvironment: vi.fn(async () => ({
            getUser: vi.fn(() => mockedUser), // On garde la même structure
          })),
        },
      })),
      useNavigation: () => ({
        getURL: vi.fn(
          (app: string, path: string) => `#mockedurl-${app}${path}`, // Retourne une URL mockée
        ),
      }),
    };
  });
};
