import { vi, it, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssistanceSidebar, { AssistanceProps } from '.';
import { mockShell } from '../mocks/sidebarMocks';
import { assistanceTree } from '../navigation-tree/assistance';

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

vi.mock('@/core/product-nav-reshuffle', () => ({
  default: () => ({
    closeNavigationSidebar: () => vi.fn(),
  }),
}));

vi.mock('@/core/container', () => ({
  default: () => ({
    setChatBotReduced: (bool: boolean) => vi.fn().mockResolvedValue(bool),
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
};

const renderAssistanceSidebar = (props: AssistanceProps) => {
  return render(
    <AssistanceSidebar
      nodeTree={props.nodeTree}
      selectedNode={props.selectedNode}
      isShort={props.isShort}
    />,
  );
};

const id: string = 'assistance-sidebar';

describe('AssistanceSidebar.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderAssistanceSidebar(props);
    const assistanceSidebar = queryByTestId(id);
    expect(assistanceSidebar).not.toBeNull();
    expect(assistanceSidebar.children.length).toBe(
      assistanceTree.children.length + 1,
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
    expect(screen.queryAllByTestId('short-assistance-link-item')).toHaveLength(
      assistanceTree.children.length,
    );
  });
});
