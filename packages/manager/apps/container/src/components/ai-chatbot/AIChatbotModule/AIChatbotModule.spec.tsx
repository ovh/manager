import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Suspense, useRef } from 'react';
import { AIChatbotModule } from './AIChatbotModule';
import { AIChatbotConfig } from '@/types/AIChatbot.type';
import { loadRemote } from '@module-federation/runtime';

const mockUnmount = vi.fn();
const mockRender = vi.fn().mockReturnValue({ unmount: mockUnmount });

vi.mock('@module-federation/runtime', () => ({
  loadRemote: vi.fn(),
}));

const mockConfig: AIChatbotConfig = {
  locale: 'fr_FR',
  linkPolicy: 'https://www.ovhcloud.com/',
  onClose: vi.fn(),
  onTracking: vi.fn(),
};

const TestWrapper = ({ config }: { config: AIChatbotConfig }) => {
  const slotRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={slotRef} data-testid="slot-element" />
      <Suspense fallback={<div>Loading...</div>}>
        <AIChatbotModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
};

describe('AIChatbotModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadRemote).mockResolvedValue({ render: mockRender });
  });

  it('should load the remote module', async () => {
    render(<TestWrapper config={mockConfig} />);

    await waitFor(() => {
      expect(loadRemote).toHaveBeenCalledWith('aiChatbot/ChatBot');
    });
  });

  it('should call render with element and config', async () => {
    render(<TestWrapper config={mockConfig} />);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalled();
    });

    const [[element, config]] = mockRender.mock.calls;
    expect(element).toBeInstanceOf(HTMLElement);
    expect(config).toEqual(mockConfig);
  });

  it('should call unmount on cleanup', async () => {
    const { unmount } = render(<TestWrapper config={mockConfig} />);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalled();
    });

    unmount();
    expect(mockUnmount).toHaveBeenCalled();
  });
});
