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

let portalElement : HTMLDivElement = null;
beforeAll(() => {
  portalElement = document.createElement('div');
  document.body.appendChild(portalElement);
});

vi.mock('@/core/product-nav-reshuffle', () => ({
  default: vi.fn(() => ({
    isFirstTabDone: false,
    setIsFirstTabDone: vi.fn(),
    skipToTheMainContentSlot: {current: portalElement},
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
    const link = getByTestId('skipToMainContentLink');

    expect(button).toHaveClass('hidden');
    
    act(() => {
      fireEvent.focus(link);
    });

    expect(button).toHaveClass('flex');
  })
});