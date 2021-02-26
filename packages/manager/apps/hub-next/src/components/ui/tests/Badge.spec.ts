import { mount } from '@vue/test-utils';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  it('should display Badge with the tag we want', () => {
    // Arrange
    const wrapper = mount(Badge, {
      props: {
        htmlTag: 'a',
      },
    });

    // Act
    const aBadge = wrapper.find('a.oui-badge');

    // Assert
    expect(aBadge.exists()).toBe(true);
  });

  it('should contain text content provided', () => {
    // Arrange
    const textContent = 'Content of test';
    const wrapper = mount(Badge, {
      props: {
        htmlTag: 'a',
        textContent,
      },
    });

    // Act
    const aBadge = wrapper.find('a.oui-badge');
    const htmlContent = aBadge.element.innerHTML;

    // Assert
    expect(htmlContent).toEqual(textContent);
  });
});
