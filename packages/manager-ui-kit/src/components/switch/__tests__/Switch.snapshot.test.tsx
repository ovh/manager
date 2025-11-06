import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Switch, SwitchItem } from '@/components';

describe('Switch Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <Switch>
        <SwitchItem value="item-1">Item 1</SwitchItem>
        <SwitchItem value="item-2">Item 2</SwitchItem>
        <SwitchItem value="item-3">Item 3</SwitchItem>
      </Switch>,
    );
    expect(container).toMatchSnapshot();
  });
});
