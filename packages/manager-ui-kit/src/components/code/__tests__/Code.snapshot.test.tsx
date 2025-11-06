import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Code } from '@/components';

describe('Code Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Code canCopy>{`import { Text } from '@ovhcloud/ods-react';`}</Code>,
    );
    expect(container).toMatchSnapshot();
  });
});
