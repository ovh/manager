import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Toggle, ToggleControl, ToggleLabel } from '..';

describe('Toggle Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Toggle>
        <ToggleControl />
        <ToggleLabel>Enable dark mode</ToggleLabel>
      </Toggle>,
    );
    expect(container).toMatchSnapshot();
  });
});
