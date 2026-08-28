import { vi, it, describe, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssistanceSidebar, { AssistanceProps } from '.';
import { mockPlugins, mockShell, mockUser } from '../mocks/sidebarMocks';
import { assistanceTree } from '../navigation-tree/assistance';

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

vi.mock('@/core/product-nav-reshuffle', () => ({
  default: () => ({
    closeNavigationSidebar: () => vi.fn(),
    setPopoverPosition: () => vi.fn(),
  }),
}));

const mockSetAIChatbotOpen = vi.fn();

vi.mock('@/core/container', () => ({
  default: () => ({
    setChatbotReduced: (bool: boolean) => vi.fn().mockResolvedValue(bool),
    setAIChatbotOpen: mockSetAIChatbotOpen,
    chatbotOpen: false,
  }),
}));

vi.mock('./ShortAssistanceLinkItem', () => ({
  ShortAssistanceLinkItem: () => (
    <div data-testid="short-assistance-link-item" />
  ),
}));
vi.mock('./AssistanceLinkItem', () => ({
  AssistanceLinkItem: () => <div data-testid="assistance-link-item" />,
}));

vi.mock('@/container/common/urls-constants', () => ({
  useURL: () => ({
    get: vi.fn(),
  }),
}));

const props: AssistanceProps = {
  nodeTree: assistanceTree,
  isShort: false,
  selectedNode: null,
  isLoading: false,
};

const renderAssistanceSidebar = (props: AssistanceProps) => {
  return render(
    <AssistanceSidebar
      nodeTree={props.nodeTree}
      selectedNode={props.selectedNode}
      isShort={props.isShort}
      isLoading={props.isLoading}
    />,
  );
};

const id = 'assistance-sidebar';

describe('AssistanceSidebar.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.ovhSubsidiary = 'FR';
  });

  it('should render', () => {
    const { queryByTestId } = renderAssistanceSidebar(props);
    const assistanceSidebar = queryByTestId(id);
    expect(assistanceSidebar).not.toBeNull();
    expect(assistanceSidebar.children.length).toBe(
      assistanceTree.children.length,
    );
  });

  it('should only render assistance link item if short is false', () => {
    renderAssistanceSidebar(props);
    expect(screen.queryAllByTestId('assistance-link-item')).toHaveLength(
      assistanceTree.children.length,
    );
  });

  it('should only render assistance link item if short is true', () => {
    props.isShort = true;
    renderAssistanceSidebar(props);
    expect(
      screen.queryAllByTestId('short-assistance-link-popover-anchor'),
    ).not.toBeNull();
  });

  describe('Digital Agent in primary', () => {
    const clickLivechat = () => {
      renderAssistanceSidebar({ ...props, isShort: false });
      assistanceTree.children.find((node) => node.id === 'livechat')?.onClick();
    };

    it('should not open the V6 live chat for FR customers on the EU manager', () => {
      mockUser.ovhSubsidiary = 'FR';
      clickLivechat();
      expect(mockPlugins.ux.openLiveChat).not.toHaveBeenCalled();
      expect(mockPlugins.tracking.trackClick).toHaveBeenCalledWith({
        name: 'navbar_v3_entry_home::assistance_live_chat',
        type: 'navigation',
      });
    });

    it('should still open the V6 live chat for the other subsidiaries', () => {
      mockUser.ovhSubsidiary = 'GB';
      clickLivechat();
      expect(mockPlugins.ux.openLiveChat).toHaveBeenCalled();
    });
  });

  describe('AI Chatbot Integration', () => {
    it('should include AI chatbot entry in the tree', () => {
      const aiChatbotNode = assistanceTree.children.find(
        (node) => node.id === 'ai_chatbot',
      );
      expect(aiChatbotNode).toBeDefined();
      expect(aiChatbotNode?.features).toContain('ai-chatbot');
    });

    it('should have correct region restrictions for AI chatbot', () => {
      const aiChatbotNode = assistanceTree.children.find(
        (node) => node.id === 'ai_chatbot',
      );
      expect(aiChatbotNode?.region).toEqual(['EU', 'CA']);
    });

    it('should have correct translation key for AI chatbot', () => {
      const aiChatbotNode = assistanceTree.children.find(
        (node) => node.id === 'ai_chatbot',
      );
      expect(aiChatbotNode?.translation).toBe('sidebar_assistance_ai_chatbot');
    });
  });
});
