import { shallowMount } from '@vue/test-utils';
import Sidebar from '@/components/ui/Sidebar';

describe('Sidebar', () => {
  it('should align right by default', () => {
    // Arrange
    const wrapper = shallowMount(Sidebar);
    // Act
    const rightClass = wrapper.find('.right');
    // Assert
    expect(rightClass.exists()).toBeTruthy();
  });

  it('should align left when props passed', () => {
    // Arrange
    const wrapper = shallowMount(Sidebar, {
      props: {
        left: true,
      },
    });
    // Act
    const leftClass = wrapper.find('.left');
    // Assert
    expect(leftClass.exists()).toBeTruthy();
  })
});
