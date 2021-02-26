/* eslint-disable @typescript-eslint/camelcase */
import { mount, VueWrapper } from '@vue/test-utils';
import Tile from '@/components/ui/Tile';
import { ComponentPublicInstance } from 'vue';
import { createI18n } from 'vue-i18n';
import Badge from '../Badge';

describe('Tile', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;

  beforeEach(() => {
    const i18n = createI18n({
      locale: 'fr_FR',
      messages: {
        fr_FR: {
          manager_hub_products_see_all: 'show',
        },
      },
    });

    wrapper = mount(Tile, {
      props: {
        title: 'title',
        count: 10,
      },
      global: {
        plugins: [i18n],
      },
    });
  });

  it('should not show header if empty', async () => {
    // Arrange
    const title = '';
    await wrapper.setProps({
      title,
    });

    // Act
    const header = wrapper.find('.ovh-manager-hub-tile__header');

    // Assert
    expect(header.exists()).toBe(false);
  });

  it('should show badge if count positive', async () => {
    // Arrange
    // Act
    const badge = wrapper.findComponent(Badge);

    // Assert
    expect(badge.exists()).toBe(true);
  });
});
