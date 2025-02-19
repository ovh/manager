import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import { ListCell, TListCellItem } from './ListCell.component';

const items: TListCellItem[] = [
  {
    id: '123456',
    name: 'foo',
  },
  {
    id: '78910',
    name: 'bar',
  },
];

describe('Considering the ListCell component', () => {
  test('Should render the component with given items', () => {
    render(<ListCell isLoading={false} items={items} />);
    items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });
});
