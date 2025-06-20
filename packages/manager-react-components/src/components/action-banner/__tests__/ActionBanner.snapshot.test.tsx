import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { MESSAGE_VARIANT, MESSAGE_COLOR } from '@ovhcloud/ods-react';
import { ActionBanner } from '../ActionBanner.component';

describe('ActionBanner Snapshot Tests', () => {
  it('Displays ActionBanner', () => {
    const { container } = render(
      <ActionBanner message="Test Message" variant={MESSAGE_VARIANT.default} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Critical ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.critical}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Neutral ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.neutral}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Information ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.information}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Primary ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.primary}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays success ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.success}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Warning ActionBanner', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.warning}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays ActionBanner with Button', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.information}
        label="Button Label"
        onClick={vitest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays ActionBanner with Link', () => {
    const { container } = render(
      <ActionBanner
        message="Test Message"
        variant={MESSAGE_VARIANT.default}
        color={MESSAGE_COLOR.information}
        label="Link Label"
        href="https://www.ovhcloud.com"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
