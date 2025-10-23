import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Radio, RadioControl, RadioGroup, RadioLabel } from '..';

describe('RadioGroup Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <RadioGroup>
        <Radio value="html">
          <RadioControl />
          <RadioLabel>HTML</RadioLabel>
        </Radio>
        <Radio value="css">
          <RadioControl />
          <RadioLabel>CSS</RadioLabel>
        </Radio>
        <Radio value="js">
          <RadioControl />
          <RadioLabel>JavaScript</RadioLabel>
        </Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
