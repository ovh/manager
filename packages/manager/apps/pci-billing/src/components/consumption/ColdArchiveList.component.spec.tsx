import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ColdArchiveList from './ColdArchiveList.component';

describe('ColdArchiveList', () => {
  const mockColdArchives = [
    {
      name: 'archive',
      quantity: {
        value: 0,
        unit: 'Hour',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
    {
      name: 'restore',
      quantity: {
        value: 0,
        unit: 'Unit',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
    {
      name: 'archive-fees',
      quantity: {
        value: 0,
        unit: 'Hour',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
  ];

  it('matches snapshot with existing coldArchives', () => {
    const { asFragment } = render(
      <ColdArchiveList coldArchives={mockColdArchives} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty coldArchives', () => {
    const { asFragment } = render(<ColdArchiveList coldArchives={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
