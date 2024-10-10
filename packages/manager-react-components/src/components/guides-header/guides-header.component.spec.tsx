import { fireEvent } from '@testing-library/react';
import { GuidesHeader, GuidesHeaderProps } from './guides-header.component';
import { render } from '../../utils/test.provider';

const renderComponent = (props: GuidesHeaderProps) => {
  return render(<GuidesHeader {...props} />);
};

const guides = {
  foo: {
    key: 'foo-guide',
    url: {
      EU: 'foo-eu',
      US: 'foo-us',
    },
  },
  bar: {
    key: 'bar-guide',
    url: {
      EU: 'bar-eu',
      US: 'bar-us',
    },
  },
};

describe('GuidesHeader tests', () => {
  it('should display guides list', () => {
    const { container } = renderComponent({
      label: 'hello',
      guides,
      ovhSubsidiary: 'EU',
      getGuideLabel: (guide) => guide.key,
    });
    expect(container.querySelector('[label="foo-guide"]')).not.toBeNull();
    expect(container.querySelector('[label="bar-guide"]')).not.toBeNull();
  });

  it('should display guides urls depending on ovhSubsidiary', () => {
    let { container } = renderComponent({
      label: 'hello',
      guides,
      ovhSubsidiary: 'EU',
      getGuideLabel: (guide) => guide.key,
    });
    expect(container.querySelector('[href=foo-us]')).toBeNull();
    expect(container.querySelector('[href=foo-eu]')).not.toBeNull();
    expect(container.querySelector('[href=bar-us]')).toBeNull();
    expect(container.querySelector('[href=bar-eu]')).not.toBeNull();
    container = renderComponent({
      label: 'hello',
      guides,
      ovhSubsidiary: 'US',
      getGuideLabel: (guide) => guide.key,
    }).container;
    expect(container.querySelector('[href=foo-us]')).not.toBeNull();
    expect(container.querySelector('[href=foo-eu]')).toBeNull();
    expect(container.querySelector('[href=bar-us]')).not.toBeNull();
    expect(container.querySelector('[href=bar-eu]')).toBeNull();
  });

  it('should trigger onGuideClick', () => {
    const onGuideClick = jest.fn();
    const { container } = renderComponent({
      label: 'hello',
      guides,
      ovhSubsidiary: 'EU',
      getGuideLabel: (guide) => guide.key,
      onGuideClick,
    });
    expect(onGuideClick).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('[href=foo-eu]'));
    expect(onGuideClick).toHaveBeenCalled();
  });

  it('should not trigger onGuideClick if it is undefined', () => {
    const onGuideClick = jest.fn();
    const { container } = renderComponent({
      label: 'hello',
      guides,
      ovhSubsidiary: 'EU',
      getGuideLabel: (guide) => guide.key,
      onGuideClick: undefined,
    });
    expect(onGuideClick).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('[href=foo-eu]'));
    expect(onGuideClick).not.toHaveBeenCalled();
  });
});
