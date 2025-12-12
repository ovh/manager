import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import LanguageButton, { Props } from './Button';
import { ContainerProvider } from '@/core/container';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';

const handleClick = vi.fn();

const props: Props = {
  show: false,
  onClick: handleClick,
};

const baseWrapper = getComponentWrapper({
  withQueryClientProvider: true,
  configuration: {
    user: {
      ovhSubsidiary: 'FR',
    },
  },
});

vi.mock('react-responsive');

const renderLanguageButton = (props: Props) => {
  return render(
    baseWrapper(
      <ContainerProvider>
        <LanguageButton
          show={props.show}
          onClick={props.onClick}
        />
      </ContainerProvider>,
    ),
  );
};

describe('LanguageButton.component', () => {
  it('should render', () => {
    expect(
      renderLanguageButton(props).getByTestId('languageButton'),
    ).not.toBeNull();
  });

  it('should have the correct aria properties', () => {
    const { t } = useTranslation('language');
    const { queryByTestId } = renderLanguageButton(props);
    const languageButton = queryByTestId('languageButton');

    // test for title property
    expect(languageButton).toHaveAccessibleDescription(t('language_change'));

    expect(languageButton).toHaveAttribute('aria-label', t('language_change'));
    expect(languageButton).toHaveAttribute('aria-haspopup', 'false');
    expect(languageButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should have aria expended and haspopup if show is true', () => {
    props.show = true;
    const { queryByTestId } = renderLanguageButton(props);

    expect(queryByTestId('languageButton')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(queryByTestId('languageButton')).toHaveAttribute(
      'aria-haspopup',
      'true',
    );
  });
});
