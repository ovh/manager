import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { Region } from '@ovh-ux/manager-config';
import AIChatbot from './AIChatbot.component';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import useContainer from '@/core/container';

vi.mock('@/core/container', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/container')>();
  return {
    ...actual,
    default: vi.fn(),
  };
});

vi.mock('../AIChatbotModule/AIChatbotModule', () => ({
  AIChatbotModule: () => <div data-testid="ai-chatbot-module">Module</div>,
}));

vi.mock('../ChatbotButton/ChatbotButton.component', () => ({
  default: () => <div data-testid="chatbot-button">CTA Button</div>,
}));

const mockContainer = (overrides = {}) => {
  vi.mocked(useContainer).mockReturnValue({
    aiChatbotOpen: false,
    aiChatbotReduced: false,
    isAIChatbotEnabled: true,
    chatbotOpen: false,
    ...overrides,
  } as ReturnType<typeof useContainer>);
};

const wrapper = getComponentWrapper({ configuration: { region: Region.EU } });

const renderWithSuspense = () =>
  render(
    wrapper(
      <Suspense fallback={<div>Loading...</div>}>
        <AIChatbot />
      </Suspense>,
    ),
  );

describe('AIChatbot.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render in US region', () => {
    const usWrapper = getComponentWrapper({
      configuration: { region: Region.US },
    });
    mockContainer();

    const { container } = render(usWrapper(<AIChatbot />));
    expect(container.firstChild).toBeNull();
  });

  it('should not render if isAIChatbotEnabled is false', () => {
    mockContainer({ isAIChatbotEnabled: false });

    const { container } = render(wrapper(<AIChatbot />));
    expect(container.firstChild).toBeNull();
  });

  it('should display CTA button when chatbot is closed and LiveChat is closed', () => {
    mockContainer();

    render(wrapper(<AIChatbot />));
    expect(screen.getByTestId('chatbot-button')).toBeInTheDocument();
  });

  it('should hide CTA button when LiveChat is open', () => {
    mockContainer({ chatbotOpen: true });

    render(wrapper(<AIChatbot />));
    expect(screen.queryByTestId('chatbot-button')).not.toBeInTheDocument();
  });

  it('should display chatbot module when aiChatbotOpen is true', () => {
    mockContainer({ aiChatbotOpen: true });

    renderWithSuspense();
    expect(screen.getByTestId('ai-chatbot-module')).toBeInTheDocument();
  });

  it('should hide chatbot module when aiChatbotOpen is false', () => {
    mockContainer();

    renderWithSuspense();
    expect(screen.queryByTestId('ai-chatbot-module')).not.toBeInTheDocument();
  });

  it('should apply reduced class when aiChatbotReduced is true', () => {
    mockContainer({ aiChatbotOpen: true, aiChatbotReduced: true });

    const { getByTestId } = renderWithSuspense();
    const chatbotContainer = getByTestId('ai-chatbot-wrapper').querySelector(
      'div[class*="reduced"]',
    );
    expect(chatbotContainer).toBeInTheDocument();
  });
});
