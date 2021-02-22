import { mount } from '@vue/test-utils';
import Dropdown from '@/components/ui/Dropdown.vue';
import { nextTick } from 'vue';

describe('Dropdown', () => {
  it('should display all prop entries', async () => {
    // Arrange
    const entries = ['1', '2', '3'];
    const wrapper = mount(Dropdown, {
      props: {
        entries,
      },
    });
    wrapper.vm.dropdownShown = true;

    await nextTick();

    // Act
    const htmlEntries = wrapper.findAll('.entry');
    // Assert
    expect(htmlEntries).toHaveLength(entries.length);
  });

  it('should display dropdown on click', async () => {
    // Arrange
    const wrapper = mount(Dropdown, {
      slots: {
        default: '<button>Click me</button>',
      },
    });

    // Act
    const button = wrapper.find('.dropdown-clickable>button');
    await button.trigger('click');
    const dropdown = wrapper.findAll('.dropdown');

    // Assert
    expect(dropdown).toHaveLength(1);
  });
});
