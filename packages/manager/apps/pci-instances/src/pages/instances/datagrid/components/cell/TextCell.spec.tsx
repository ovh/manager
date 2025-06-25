import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import { BaseTextCell, TextCell } from './TextCell.component';

describe('Considering the text cell components', () => {
  test('Should render BaseTextCell component correctly with children', () => {
    render(
      <BaseTextCell>
        <div>Foo</div>
      </BaseTextCell>,
    );
    const baseTextCellElement = screen.getByTestId('base-text-cell');
    expect(baseTextCellElement).toBeInTheDocument();
    const childElement = screen.getByText('Foo');
    expect(childElement).toBeInTheDocument();
  });

  test('Should render TextCell component correctly with label', () => {
    render(<TextCell isLoading={false} label="foo" />);
    const textCellElement = screen.getByText('foo');
    expect(textCellElement).toBeInTheDocument();
  });
});
