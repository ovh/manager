import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Combobox } from '@/components/combobox/Combobox.component';
import { ComboboxContent } from '@/components/combobox/combobox-content/ComboboxContent.component';
import { ComboboxControl } from '@/components/combobox/combobox-control/ComboboxControl.component';

describe('Combobox Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Combobox
        items={[
          {
            label: 'Dog',
            value: 'dog',
          },
          {
            label: 'Cat',
            value: 'cat',
          },
          {
            label: 'Hamster',
            value: 'hamster',
          },
          {
            label: 'Parrot',
            value: 'parrot',
          },
          {
            label: 'Spider',
            value: 'spider',
          },
          {
            label: 'Goldfish',
            value: 'goldfish',
          },
        ]}
      >
        <ComboboxControl />
        <ComboboxContent />
      </Combobox>,
    );
    expect(container).toMatchSnapshot();
  });
});
