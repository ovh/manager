import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { KeyPairName } from '@ovh-ux/manager-config';
import LanguageMenu, { Props } from './index';

const handleChange = vi.fn();
const handleSetUserLanguge = vi.fn();

const props: Props = {
  onChange: handleChange,
  setUserLocale: handleSetUserLanguge,
  userLocale: 'en_GB',
};

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: () => ({
      setLocale: vi.fn(() => 'en_GB'),
      getAvailableLocales: vi.fn(() =>
        Array<KeyPairName>(
          { name: 'English', key: 'en_GB' },
          { name: 'Français', key: 'fr_FR' },
        ),
      ),
    }),
  }),
}));

vi.mock('react-responsive');

const renderLanguageMenu = (props: Props) => {
  return render(
    <LanguageMenu
      onChange={props.onChange}
      setUserLocale={props.setUserLocale}
      userLocale={props.userLocale}
    />,
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
