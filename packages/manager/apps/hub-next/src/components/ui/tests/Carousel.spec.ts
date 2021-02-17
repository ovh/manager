import { mount, VueWrapper } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Carousel from '@/components/ui/Carousel.vue';
import { ComponentPublicInstance } from 'vue';

describe('Carousel', () => {
  const i18n = createI18n({
    locale: 'fr-FR',
    messages: {
      'fr-FR': {
        // eslint-disable-next-line @typescript-eslint/camelcase
        manager_hub_carousel_see_next: 'suivant',
      },
    },
  });
  let wrapper: VueWrapper<ComponentPublicInstance>;

  const messages = ['message one', 'message two', 'message three'];

  beforeEach(() => {
    // Arrange
    wrapper = mount(Carousel, {
      global: {
        plugins: [i18n],
      },
      props: {
        messages,
      },
    });
  });

  it('should show one message', () => {
    // Arrange/Act
    const htmlMessage = wrapper.findAll('.oui-message__body');

    // Assert
    expect(htmlMessage).toHaveLength(1);
  });

  it('should show multiple bullets when multiple messages', () => {
    // Arrange/Act
    const bullets = wrapper.findAll('.circular-tile');

    // Assert
    expect(bullets).toHaveLength(messages.length);
  });

  it('should always have one active bullet when multiple messages', () => {
    // Arrange/Act
    const activeBullets = wrapper.findAll('.circular-tile_active');

    // Assert
    expect(activeBullets).toHaveLength(1);
  });
});
