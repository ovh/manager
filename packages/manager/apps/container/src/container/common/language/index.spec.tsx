import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { KeyPairName } from '@ovh-ux/manager-config';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import LanguageMenu, { Props } from './index';

vi.mock('@ovh-ux/manager-react-components', () => ({
  fetchFeatureAvailabilityData: vi.fn(() => Promise.resolve({ pnr: false, livechat: false })),
}));

const wrapper = getComponentWrapper({
  withContainerProvider: true,
  configuration: {},
});

const handleChange = vi.fn();
const handleSetUserLanguge = vi.fn();

const props: Props = {
  onChange: handleChange,
  setUserLocale: handleSetUserLanguge,
  userLocale: 'en_GB',
};

vi.mock('react-responsive');

const renderLanguageMenu = (props: Props) => {
  return render(
    wrapper(
      <LanguageMenu
        onChange={props.onChange}
        setUserLocale={props.setUserLocale}
        userLocale={props.userLocale}
      />,
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
