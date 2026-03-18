import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { handleEnterAndEscapeKeyDown } from '../handleEnterAndEscapeKeyDown';

describe('handleEnterAndEscapeKeyDown', () => {
  it('calls onEnter when Enter key is pressed', () => {
    const onEnter = vi.fn();
    const onEscape = vi.fn();

    const handler = handleEnterAndEscapeKeyDown({ onEnter, onEscape });

    const { getByTestId } = render(
      <div role="button" data-testid="target" tabIndex={0} onKeyDown={handler} />,
    );
    const target = getByTestId('target');

    fireEvent.keyDown(target, { key: 'Enter' });

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('calls onEnter when Space key is pressed', () => {
    const onEnter = vi.fn();
    const handler = handleEnterAndEscapeKeyDown({ onEnter });

    const { getByTestId } = render(
      <div role="button" data-testid="target" tabIndex={0} onKeyDown={handler} />,
    );
    const target = getByTestId('target');

    fireEvent.keyDown(target, { key: ' ' });

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('calls onEscape when Escape key is pressed', () => {
    const onEscape = vi.fn();
    const onEnter = vi.fn();
    const handler = handleEnterAndEscapeKeyDown({ onEnter, onEscape });

    const { getByTestId } = render(
      <div role="button" data-testid="target" tabIndex={0} onKeyDown={handler} />,
    );
    const target = getByTestId('target');

    fireEvent.keyDown(target, { key: 'Escape' });

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('does nothing for other keys', () => {
    const onEnter = vi.fn();
    const onEscape = vi.fn();
    const handler = handleEnterAndEscapeKeyDown({ onEnter, onEscape });

    const { getByTestId } = render(
      <div role="button" data-testid="target" tabIndex={0} onKeyDown={handler} />,
    );
    const target = getByTestId('target');

    fireEvent.keyDown(target, { key: 'ArrowDown' });

    expect(onEnter).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('does not throw when callbacks are undefined', () => {
    const handler = handleEnterAndEscapeKeyDown({});

    const { getByTestId } = render(
      <div role="button" data-testid="target" tabIndex={0} onKeyDown={handler} />,
    );
    const target = getByTestId('target');

    expect(() => fireEvent.keyDown(target, { key: 'Enter' })).not.toThrow();
    expect(() => fireEvent.keyDown(target, { key: 'Escape' })).not.toThrow();
  });
});
