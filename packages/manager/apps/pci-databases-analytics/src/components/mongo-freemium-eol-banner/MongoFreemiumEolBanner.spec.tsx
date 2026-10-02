import { describe, it, expect, vi, afterEach } from 'vitest';
import { cloneElement, ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Locale, useLocale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import MongoFreemiumEolBanner from './MongoFreemiumEolBanner.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ components }: { components: Record<string, ReactElement> }) => (
    <>
      {Object.entries(components).map(([name, component]) =>
        cloneElement(component, { key: name }, name),
      )}
    </>
  ),
}));

vi.mock('@/hooks/useLocale', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/hooks/useLocale')>()),
  useLocale: vi.fn(() => 'fr_FR'),
}));

const FR_PROCEDURE =
  'https://docs.ovhcloud.com/fr/guides/public-cloud/databases/mongodb-howto-backup-restore';
const EN_PROCEDURE =
  'https://docs.ovhcloud.com/en/guides/public-cloud/databases/mongodb-howto-backup-restore';

describe('MongoFreemiumEolBanner', () => {
  afterEach(() => {
    vi.mocked(useLocale).mockReturnValue(Locale.fr_FR);
  });

  it('links to the migration target', () => {
    render(<MongoFreemiumEolBanner migrateTo="serviceId/settings#update" />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('mongo-freemium-eol-banner')).toBeInTheDocument();
    expect(
      screen.getByTestId('mongo-freemium-eol-migrate-link'),
    ).toHaveAttribute('href', expect.stringContaining('serviceId/settings#update'));
  });

  it.each([Locale.fr_FR, Locale.fr_CA])(
    'links to the French procedure for %s',
    (locale) => {
      vi.mocked(useLocale).mockReturnValue(locale);
      render(<MongoFreemiumEolBanner migrateTo="settings#update" />, {
        wrapper: RouterWithQueryClientWrapper,
      });
      expect(
        screen.getByTestId('mongo-freemium-eol-procedure-link'),
      ).toHaveAttribute('href', FR_PROCEDURE);
    },
  );

  it.each([Locale.en_GB, Locale.de_DE, Locale.es_ES, Locale.pl_PL])(
    'links to the English procedure for %s',
    (locale) => {
      vi.mocked(useLocale).mockReturnValue(locale);
      render(<MongoFreemiumEolBanner migrateTo="settings#update" />, {
        wrapper: RouterWithQueryClientWrapper,
      });
      expect(
        screen.getByTestId('mongo-freemium-eol-procedure-link'),
      ).toHaveAttribute('href', EN_PROCEDURE);
    },
  );
});
