import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatbotButton from './ChatbotButton.component';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import useContainer from '@/core/container';

const mockSetAIChatbotOpen = vi.fn();

vi.mock('@/core/container', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/container')>();
  return {
    ...actual,
    default: vi.fn(),
  };
});

const mockContainer = (overrides = {}) => {
  vi.mocked(useContainer).mockReturnValue({
    aiChatbotOpen: false,
    setAIChatbotOpen: mockSetAIChatbotOpen,
    chatbotOpen: false,
    ...overrides,
  } as any);
};

const wrapper = getComponentWrapper({ configuration: {} });

describe('ChatbotButton.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the button with aria-label', () => {
    mockContainer();

    render(wrapper(<ChatbotButton />));

    const button = screen.getByTestId('ai-chatbot-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'ai_chatbot_open');
  });

  it('should call setAIChatbotOpen(true) on click when closed', () => {
    mockContainer();

    render(wrapper(<ChatbotButton />));
    fireEvent.click(screen.getByTestId('ai-chatbot-button'));

    expect(mockSetAIChatbotOpen).toHaveBeenCalledWith(true);
  });

  it('should call setAIChatbotOpen(false) on click when open', () => {
    mockContainer({ aiChatbotOpen: true });

    render(wrapper(<ChatbotButton />));
    fireEvent.click(screen.getByTestId('ai-chatbot-button'));

    expect(mockSetAIChatbotOpen).toHaveBeenCalledWith(false);
  });
});
