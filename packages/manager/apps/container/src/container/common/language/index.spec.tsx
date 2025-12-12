import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { KeyPairName } from '@ovh-ux/manager-config';
import LanguageMenu, { Props } from './index';
import { ContainerProvider } from '@/core/container';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';

const handleChange = vi.fn();
const handleSetUserLanguge = vi.fn();

const props: Props = {
  onChange: handleChange,
  setUserLocale: handleSetUserLanguge,
  userLocale: 'en_GB',
};

const baseWrapper = getComponentWrapper({
  withQueryClientProvider: true,
  configuration: {
    user: {
      ovhSubsidiary: 'FR',
    },
  },
});

vi.mock('@/context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context')>();
  return {
    ...actual,
    useShell: () => ({
      getPlugin: (pluginName: string) => {
        if (pluginName === 'i18n') {
          return {
            setLocale: vi.fn(() => 'en_GB'),
            getAvailableLocales: vi.fn(() =>
              Array<KeyPairName>(
                { name: 'English', key: 'en_GB' },
                { name: 'Français', key: 'fr_FR' },
              ),
            ),
          };
        }
        if (pluginName === 'ux') {
          return {
            onChatbotVisibilityChange: vi.fn(),
            isChatbotVisible: vi.fn().mockResolvedValue(false),
          };
        }
        if (pluginName === 'environment') {
          return {
            onUniverseChange: vi.fn(),
            setUniverse: vi.fn(),
            getEnvironment: vi.fn().mockReturnValue({
              getUser: vi.fn(),
              getRegion: vi.fn(),
            }),
          };
        }
        return {};
      },
    }),
  };
});

vi.mock('react-responsive');

const renderLanguageMenu = (props: Props) => {
  return render(
    baseWrapper(
      <ContainerProvider>
        <LanguageMenu
          onChange={props.onChange}
          setUserLocale={props.setUserLocale}
          userLocale={props.userLocale}
        />
      </ContainerProvider>,
    ),
  );
};

describe('LanguageMenu.component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render', () => {
    expect(
      renderLanguageMenu(props).getByTestId('languageMenu'),
    ).not.toBeNull();
  });

  it('should have the language in short length on small devices', async () => {
    (await import('react-responsive')).useMediaQuery = vi
      .fn()
      .mockReturnValue(true);
    expect(
      renderLanguageMenu(props).getByTestId('languageButton'),
    ).toHaveTextContent('GB');
  });

  it('should have the language in full length on regular devices', () => {
    expect(
      renderLanguageMenu(props).getByTestId('languageButton'),
    ).toHaveTextContent('English');
  });
});
