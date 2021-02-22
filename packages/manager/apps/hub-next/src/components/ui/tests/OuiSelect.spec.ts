import { mount, VueWrapper } from '@vue/test-utils';
import OuiSelect from '@/components/ui/OuiSelect.vue';
import { ComponentPublicInstance } from 'vue';

describe('OuiSelect', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  const options = [
    {
      value: 'Option 1',
      key: 1,
    },
    {
      value: 'Option 2',
      key: 3,
    },
  ];

  beforeEach(() => {
    wrapper = mount(OuiSelect, {
      props: {
        options,
        selectedOption: 1,
      },
    });
  });

  it('should render options when displayed', async () => {
    // Arrange/Act
    await wrapper.find('.fake-input-wrapper').trigger('click');
    const optionsHtml = wrapper.findAll('.v-oui-option');

    // Assert
    expect(optionsHtml).toHaveLength(options.length);
  });

  it('should have a fake input displayed', () => {
    // Arrange/Act
    const fakeInput = wrapper.find('.fake-input');

    // Assert
    expect(fakeInput).toBeDefined();
  });
});
