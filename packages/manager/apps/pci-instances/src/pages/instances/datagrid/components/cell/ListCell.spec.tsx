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
  { id: '3612', name: 'floatingIp', href: 'floaint' },
];

describe('Considering the ListCell component', () => {
  test('Should render the component with given items', () => {
    render(<ListCell isLoading={false} items={items} />);
    items.forEach((item) => {
      const el = screen.getByText(item.name);
      expect(el).toBeInTheDocument();
      if (item.href) {
        expect(el).toHaveAttribute('href', item.href);
      }
    });
  });
});
