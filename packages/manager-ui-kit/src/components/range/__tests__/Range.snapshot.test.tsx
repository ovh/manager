import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Range } from '@/components';

describe('Range Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Range />
        <Range defaultValue={[50, 75]} />
        <Range defaultValue={[20]} disabled />
        <Range defaultValue={[50, 75]} disabled />
        <p>Max 500</p>
        <Range defaultValue={[50]} max={500} />
        <Range defaultValue={[50, 75]} max={500} />
        <p>Min 25</p>
        <Range defaultValue={[50]} min={25} />
        <Range defaultValue={[50, 75]} min={25} />
        <p>Max 75 & Min 25</p>
        <Range defaultValue={[50]} max={75} min={25} />
        <Range defaultValue={[50, 75]} max={75} min={25} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
