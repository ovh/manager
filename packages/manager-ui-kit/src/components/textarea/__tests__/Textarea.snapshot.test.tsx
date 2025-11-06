import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Textarea } from '@/components';

describe('Textarea Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Textarea />
        <Textarea disabled />
        <Textarea defaultValue="Readonly" readOnly />
        <Textarea
          style={{
            resize: 'both',
          }}
        />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
