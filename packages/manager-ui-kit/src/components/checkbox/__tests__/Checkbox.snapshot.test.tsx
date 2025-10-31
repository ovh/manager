import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '@/components/checkbox/Checkbox.component';
import { CheckboxControl } from '@/components/checkbox/checkbox-control/CheckboxControl.component';
import { CheckboxLabel } from '@/components/checkbox/checkbox-label/CheckboxLabel.component';

describe('Checkbox Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <>
        <Checkbox>
          <CheckboxControl />
          <CheckboxLabel>Unchecked</CheckboxLabel>
        </Checkbox>
        <Checkbox checked>
          <CheckboxControl />
          <CheckboxLabel>Checked</CheckboxLabel>
        </Checkbox>
        <Checkbox checked="indeterminate">
          <CheckboxControl />
          <CheckboxLabel>Indeterminate</CheckboxLabel>
        </Checkbox>
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
