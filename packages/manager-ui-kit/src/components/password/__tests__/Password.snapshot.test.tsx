import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Password } from '@/components';

describe('Password Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Password />
        <Password disabled />
        <Password defaultValue="Readonly" readOnly />
        <Password clearable defaultValue="Clearable" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
