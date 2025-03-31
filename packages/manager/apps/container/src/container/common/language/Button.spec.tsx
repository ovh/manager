import React from 'react';
import { it, vi, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import LanguageButton, { Props } from './Button';

const handleClick = vi.fn();

const props: Props = {
  show: false,
  onClick: handleClick,
};

const renderLanguageButton = (props: Props) => {
  return render(<LanguageButton show={props.show} onClick={props.onClick} />);
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
