import React, { useRef } from 'react';
import { it, vi, describe, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import SkipToMainContent, {Props} from './index';
import { mockShell } from '../../sidebar/mocks/sidebarMocks';

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

vi.mock('@/core/product-nav-reshuffle', () => ({
  default: vi.fn(() => ({
    isFirstTabDone: false,
    setIsFirstTabDone: vi.fn(),
    firstFocusableElement: null,
  }))
}))

const renderSkipToMainContent = () => {
  const iframeRef = { current: document.createElement("iframe")};
  return render(<SkipToMainContent iframeRef={iframeRef} />)
}

describe('SkipToMainContent.component', () => {
  it('should render', () => {
    expect(renderSkipToMainContent().queryByTestId('skipToMainContent')).not.toBeNull();
  });

  it('should appear when tab is pressed', () => {
    const { getByTestId } = renderSkipToMainContent();
    const button = getByTestId('skipToMainContent');

    expect(button).toHaveClass('hidden');
    
    act(() => {
      fireEvent.keyDown(document, { key: "Tab", code: "Tab"});
    });

    expect(button).toHaveClass('flex');
  })
});