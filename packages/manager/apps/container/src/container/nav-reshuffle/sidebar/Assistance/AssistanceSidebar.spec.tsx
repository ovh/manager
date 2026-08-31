import { vi, it, describe, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssistanceSidebar, { AssistanceProps } from '.';
import { mockPlugins, mockShell, mockUser } from '../mocks/sidebarMocks';
import { assistanceTree } from '../navigation-tree/assistance';
import SidebarLink from '../SidebarLink';

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

  describe('Live chat entry', () => {
    const getLivechatNode = () =>
      assistanceTree.children.find((node) => node.id === 'livechat');

    it.each(['FR', 'GB'])(
      'should open the V6 live chat for %s customers',
      (subsidiary) => {
        mockUser.ovhSubsidiary = subsidiary;
        renderAssistanceSidebar({ ...props, isShort: false });
        getLivechatNode()?.onClick();
        expect(mockPlugins.ux.openLiveChat).toHaveBeenCalled();
        expect(mockPlugins.tracking.trackClick).toHaveBeenCalledWith({
          name: 'navbar_v3_entry_home::assistance_live_chat',
          type: 'navigation',
        });
      },
    );

    // The live chat opens a widget, it never navigates. A url or a routing on
    // the node would turn it into a StaticLink and the click would redirect
    // (see #MANAGER-15587, where it landed on the Digital Agent instead).
    it('should not carry any url or routing', () => {
      renderAssistanceSidebar({ ...props, isShort: false });
      expect(getLivechatNode()?.url).toBeUndefined();
      expect(getLivechatNode()?.routing).toBeUndefined();
    });

    it('should render as a button and not as a link', () => {
      renderAssistanceSidebar({ ...props, isShort: false });
      const { queryByRole } = render(
        <SidebarLink node={getLivechatNode()} id="livechat-link" />,
      );
      expect(queryByRole('button')).not.toBeNull();
      expect(queryByRole('link')).toBeNull();
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
