import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxControlProp,
  type ComboboxItem,
  type ComboboxProp,
  FormField,
  FormFieldLabel,
  INPUT_I18N,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<ComboboxProp>;

(Combobox as any).__docgenInfo = docgenMap.combobox;
(ComboboxContent as any).__docgenInfo = docgenMap.comboboxContent;
(ComboboxControl as any).__docgenInfo = docgenMap.comboboxControl;

type DemoArg = Partial<ComboboxProp> & Partial<ComboboxControlProp> & {
};

const meta: Meta<ComboboxProp> = {
  argTypes: excludeFromDemoControls(['customOptionRenderer', 'defaultValue', 'i18n', 'items', 'locale', 'name', 'onInputValueChange', 'onValueChange', 'required', 'value']),
  component: Combobox,
  subcomponents: { ComboboxContent, ComboboxControl },
  title: 'Manager UI Kit/Components/Combobox/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Combobox
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}
      allowCustomValue={ arg.allowCustomValue }
      defaultValue={ arg.defaultValue }
      disabled={ arg.disabled }
      highlightResults={ arg.highlightResults }
      invalid={ arg.invalid }
      multiple={ arg.multiple }
      newElementLabel={ arg.newElementLabel }
      noResultLabel={ arg.noResultLabel }
      readOnly={ arg.readOnly }>
      <ComboboxControl clearable={ arg.clearable } placeholder={ arg.placeholder } loading={ arg.loading } />
      <ComboboxContent />
    </Combobox>
  ),
  argTypes: orderControls({
    allowCustomValue: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    clearable: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    defaultValue: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    highlightResults: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    loading: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    multiple: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    newElementLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    noResultLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
  }),
  args: {
    placeholder: 'Start typing',
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl placeholder="Combobox" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Clearable: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl
        clearable
        placeholder="Combobox" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const CustomFilter: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      customFilter={ (label, inputValue) => {
        const reversedLabel = label.split('').reverse().join('');
        return new RegExp(`^${inputValue}`, 'i').test(reversedLabel);
      }}
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl placeholder="Search from right to left in each word" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      disabled
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl placeholder="Combobox" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Readonly: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      defaultValue={ ['parrot'] }
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}
      readOnly>
      <ComboboxControl placeholder="Combobox" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Group: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      items={[
        {
          label: 'Europe',
          options: [
            { label: 'France', value: 'fr' },
            { label: 'Germany', value: 'de' },
            { label: 'Italy', value: 'it' },
          ],
        },
        {
          label: 'Asia',
          options: [
            { label: 'China', value: 'cn' },
            { label: 'Japan', value: 'jp' },
            { label: 'Russia', value: 'ru' },
          ],
        },
        { label: 'World', value: 'world' },
      ]}>
      <ComboboxControl placeholder="Combobox" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Combobox
      </FormFieldLabel>

      <Combobox
        items={[
          { label: 'Dog', value: 'dog' },
          { label: 'Cat', value: 'cat' },
        ]}>
        <ComboboxControl />

        <ComboboxContent />
      </Combobox>
    </FormField>
  ),
}

export const Invalid: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      invalid
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
      ]}>
      <ComboboxControl />

      <ComboboxContent />
    </Combobox>
  )
}

export const Controlled: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [value, setValue] = useState<string[]>(['dog']);
    return (
      <>
        <Combobox
          items={[
            { label: 'Dog', value: 'dog' },
            { label: 'Cat', value: 'cat' },
            { label: 'Hamster', value: 'hamster' },
            { label: 'Parrot', value: 'parrot' },
            { label: 'Spider', value: 'spider' },
            { label: 'Goldfish', value: 'goldfish' },
          ]}
          onValueChange={ details => setValue(details.value) }
          value={ value }>
          <ComboboxControl placeholder="Select an animal" />

          <ComboboxContent />
        </Combobox>

        <div style={{ marginTop: 8 }}>
          <strong>Selected value:</strong> { value[0] ?? 'None' }
        </div>
      </>
    );
  },
};

export const Highlight: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      highlightResults
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl />

      <ComboboxContent />
    </Combobox>
  ),
};

export const CustomOptions: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    type MyData = {
      color?: string;
      info?: string;
    };

    const items = [
      { label: 'Apple', value: 'apple', customRendererData: { color: 'red', info: 'Fruit' }},
      { label: 'Banana', value: 'banana', customRendererData: { color: 'yellow', info: 'Fruit' }},
      { label: 'Carrot', value: 'carrot', customRendererData: { color: 'orange', info: 'Vegetable' }},
      { label: 'Broccoli', value: 'broccoli', customRendererData: { color: 'green', info: 'Vegetable' }},
      { label: 'Blueberry', value: 'blueberry', customRendererData: { color: 'blue', info: 'Fruit' }},
    ];

    function customOptionRenderer(item: ComboboxItem<MyData>) {
      return (
        <span style={{ color: item.customRendererData?.color, fontWeight: 'bold' }}>
          { item.label } { item.customRendererData?.info && <span style={{ fontWeight: 'normal', fontSize: 12, color: '#888' }}>({ item.customRendererData.info })</span> }
        </span>
      );
    }

    return (
      <Combobox
        customOptionRenderer={ customOptionRenderer }
        highlightResults
        items={ items }>
        <ComboboxControl />

        <ComboboxContent />
      </Combobox>
    );
  },
};

export const Empty: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox items={ [] }>
      <ComboboxControl />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Multiple: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      multiple
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl />

      <ComboboxContent />
    </Combobox>
  ),
};

export const Placeholder: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Combobox
      items={[
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Hamster', value: 'hamster', disabled: true },
        { label: 'Parrot', value: 'parrot' },
        { label: 'Spider', value: 'spider' },
        { label: 'Goldfish', value: 'goldfish' },
      ]}>
      <ComboboxControl placeholder="Please select" />

      <ComboboxContent />
    </Combobox>
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { Combobox, ComboboxContent, ComboboxControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Favorite pet:
      </FormFieldLabel>

      <Combobox
        items={[
          { label: 'Dog', value: 'dog' },
          { label: 'Cat', value: 'cat' },
          { label: 'Hamster', value: 'hamster' },
          { label: 'Parrot', value: 'parrot' },
          { label: 'Spider', value: 'spider' },
          { label: 'Goldfish', value: 'goldfish' },
        ]}>
        <ComboboxControl />

        <ComboboxContent />
      </Combobox>
    </FormField>
  ),
};

export const AccessibilityI18n: Story = {
  globals: {
    imports: `import { INPUT_I18N, Combobox, ComboboxContent, ComboboxControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Favorite pet:
      </FormFieldLabel>

      <Combobox
        i18n={{
          [INPUT_I18N.clearButton]: 'Clear favorite pet selection'
        }}
        items={[
          { label: 'Dog', value: 'dog' },
          { label: 'Cat', value: 'cat' },
          { label: 'Hamster', value: 'hamster' },
          { label: 'Parrot', value: 'parrot' },
          { label: 'Spider', value: 'spider' },
          { label: 'Goldfish', value: 'goldfish' },
        ]}>
        <ComboboxControl clearable />

        <ComboboxContent />
      </Combobox>
    </FormField>
  ),
};
