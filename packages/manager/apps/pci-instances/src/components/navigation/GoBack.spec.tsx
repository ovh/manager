import { describe, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { GoBack } from './GoBack.component';

const backHref = '..';

vi.mock('react-router-dom', () => ({
  useHref: () => backHref,
}));

const getGoBackElement = () => {
  render(<GoBack />);
  return screen.getByText('pci_instances_common_go_back');
};

describe('Considering the GoBack component', () => {
  test('Should be rendered with correct class and href attribute', () => {
    const goBackElement = getGoBackElement();
    expect(goBackElement).toBeInTheDocument();
    expect(goBackElement).toHaveClass('mt-12 mb-3');
    expect(goBackElement).toHaveAttribute('href', backHref);
  });

  test('Should contain icon as first child element', () => {
    const goBackElement = getGoBackElement();
    expect(goBackElement.firstChild).toBeTruthy();
    expect(goBackElement.firstChild).toHaveAttribute(
      'name',
      ODS_ICON_NAME.ARROW_LEFT,
    );
  });
});
