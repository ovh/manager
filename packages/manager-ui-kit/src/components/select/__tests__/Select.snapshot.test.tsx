import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Select, SelectContent, SelectControl } from '@/components';

describe('Select Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Select
        items={[
          {
            label: 'Dog',
            value: 'dog',
          },
          {
            label: 'Cat',
            value: 'cat',
          },
          {
            label: 'Hamster',
            value: 'hamster',
          },
          {
            label: 'Parrot',
            value: 'parrot',
          },
          {
            label: 'Spider',
            value: 'spider',
          },
          {
            label: 'Goldfish',
            value: 'goldfish',
          },
        ]}
      >
        <SelectControl />
        <SelectContent />
      </Select>,
    );
    expect(container).toMatchSnapshot();
  });
});
