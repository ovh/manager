import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox, CheckboxControl, CheckboxGroup, CheckboxLabel } from '@/components';

describe('CheckboxGroup', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <CheckboxGroup defaultValue={['marketing']} name="acknowledgments">
        <Checkbox value="term">
          <CheckboxControl />
          <CheckboxLabel>I agree to the terms and conditions.</CheckboxLabel>
        </Checkbox>
        <Checkbox value="marketing">
          <CheckboxControl />
          <CheckboxLabel>I agree to receive marketing communications.</CheckboxLabel>
        </Checkbox>
      </CheckboxGroup>,
    );
    expect(container).toBeTruthy();
  });
});
