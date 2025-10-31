import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from '@/components';

describe('Input Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Input />
        <br />
        <Input disabled />
        <br />
        <Input defaultValue="Readonly" readOnly />
        <br />
        <Input clearable defaultValue="Clearable" />
        <Input placeholder="email" type="email" />
        <br />
        <Input placeholder="number" type="number" />
        <br />
        <Input placeholder="password" type="password" />
        <br />
        <Input placeholder="search" type="search" />
        <br />
        <Input placeholder="text" type="text" />
        <br />
        <Input placeholder="time" type="time" />
        <br />
        <Input placeholder="url" type="url" />
        <br />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
