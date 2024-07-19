import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { PciTile } from './PciTile.component';

describe('PciTile Component', () => {
  const title = 'Sample Title';
  const description = 'Sample Description';
  const onClickMock = vi.fn();

  it('displays title and description', () => {
    const { getByText } = render(
      <PciTile title={title} description={description} onClick={onClickMock} />,
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
  });

  it('executes onClick callback when clicked', () => {
    const { getByTestId } = render(
      <PciTile title={title} onClick={onClickMock} />,
    );
    fireEvent.click(getByTestId('pciTile-Tile'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('applies checked class when isChecked is true', () => {
    const { getByTestId } = render(
      <PciTile title={title} isChecked onClick={onClickMock} />,
    );
    const tile = getByTestId('pciTile-Tile');
    expect(tile).toHaveClass(
      'bg-[--ods-color-blue-100] border-[--ods-color-blue-600]',
    );
  });

  it('applies unchecked class when isChecked is false', () => {
    const { getByTestId } = render(
      <PciTile title={title} isChecked={false} onClick={onClickMock} />,
    );
    const tile = getByTestId('pciTile-Tile');
    expect(tile).toHaveClass('border-[--ods-color-blue-100]');
    expect(tile).toHaveClass('hover:bg-[--ods-color-blue-100]');
    expect(tile).toHaveClass('hover:border-[--ods-color-blue-600]');
  });

  it('does not display description when none is provided', () => {
    const { queryByText } = render(
      <PciTile title={title} onClick={onClickMock} />,
    );
    expect(queryByText(description)).toBeNull();
  });
});
