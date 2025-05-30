import { it, vi, describe, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import LiveChat from './LiveChat.component';
import { getCustomerLevel } from './liveChat.helpers';
import { CHAT_TYPE_STORAGE_KEY } from './liveChat.constants';
import useContainer from '@/core/container';
import { ContainerContextType } from '@/core/container/container.context';
import { format } from 'date-fns';

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: (_: 'environment') => ({
      getEnvironment: () => ({
        getRegion: () => 'EU',
        getUserLanguage: () => 'fr',
        getUser: () => ({
          ovhSubsidiary: 'FR',
          supportLevel: 'premium',
        }),
      }),
    }),
  }),
}));

const reducedLiveChat: Partial<ContainerContextType> = {
  chatbotOpen: true,
  chatbotReduced: true,
  setChatbotOpen: vi.fn(),
  setChatbotReduced: vi.fn(),
};

const openedLiveChat: Partial<ContainerContextType> = {
  chatbotOpen: true,
  chatbotReduced: false,
  setChatbotOpen: vi.fn(),
  setChatbotReduced: vi.fn(),
};

vi.mock('@/core/container', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/useSessionStorage', () => ({
  useSessionStorage: (_: typeof CHAT_TYPE_STORAGE_KEY) => [
    'Adrielly',
    vi.fn(),
    vi.fn(),
  ],
}));

const closeLiveChat = vi.fn();

describe('LiveChat.component', {}, () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.show = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    Object.defineProperty(window.HTMLIFrameElement.prototype, 'contentWindow', {
      value: {
        focus: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display the live chat component', () => {
    vi.mocked(useContainer).mockReturnValue(
      openedLiveChat as ContainerContextType,
    );

    const { getByTestId, getByRole } = render(
      <LiveChat closeLiveChat={closeLiveChat} />,
    );
    expect(getByTestId('live-chat-iframe')).toBeInTheDocument();
    expect(getByRole('dialog')).toHaveAttribute('open');
    expect(getByRole('dialog')).toHaveAttribute('aria-hidden', 'false');
  });

  it('should reduce the live chat component', () => {
    vi.mocked(useContainer).mockReturnValue(
      reducedLiveChat as ContainerContextType,
    );
    const { getByTestId, getByRole } = render(
      <LiveChat closeLiveChat={closeLiveChat} />,
    );
    expect(getByTestId('live-chat-iframe')).toBeInTheDocument();

    // timeout to wait for the useEffect to close the dialog
    waitFor(
      () => {
        expect(getByRole('dialog')).not.toHaveAttribute('open');
        expect(getByRole('dialog')).toHaveAttribute('aria-hidden', 'true');
      },
      {
        timeout: 2000,
      },
    );
  });

  it('should have the correct customer level for Adrielly', () => {
    vi.mocked(useContainer).mockReturnValue(
      openedLiveChat as ContainerContextType,
    );
    const customerLevel = getCustomerLevel('premium');
    expect(customerLevel).toBe('PRM');

    const { getByTestId } = render(<LiveChat closeLiveChat={closeLiveChat} />);
    const liveChatIFrame = getByTestId('live-chat-iframe');

    // TODO: Change url after the livechat is ready
    expect(liveChatIFrame).toHaveAttribute(
      'src',
      `https://chat.ovh.com/system/templates/liveChat-manager/STD/FR_fr/docs/index2.html?v=${format(new Date(), 'yy-MM-dd')}`,
    );
  });

  it.each([
    ['opened live chat', openedLiveChat],
    ['reduced live chat', reducedLiveChat],
  ])('should have mobile styling for the wrappers for %s', (_, context) => {
    vi.mocked(useContainer).mockReturnValue(context as ContainerContextType);
    const { getByTestId } = render(<LiveChat closeLiveChat={closeLiveChat} />);
    expect(getByTestId('live-chat-wrapper')).toHaveClass(
      'h-full xl:h-fit w-full xl:w-auto',
    );

    expect(getByTestId('live-chat-pta-wrapper')).toHaveClass(
      'order-first xl:order-last justify-between xl:justify-end bg-[#000e9c] xl:bg-transparent',
    );
  });

  it('should have mobile styling for the opened live chat component', () => {
    vi.mocked(useContainer).mockReturnValue(
      openedLiveChat as ContainerContextType,
    );
    const { getByTestId } = render(<LiveChat closeLiveChat={closeLiveChat} />);

    expect(getByTestId('live-chat-mobile-reduce-button')).toHaveClass(
      'xl:hidden',
    );
    expect(getByTestId('live-chat-desktop-reduce-button')).toHaveClass(
      'hidden xl:flex',
    );
  });

  it('should have mobile styling for the reduced live chat component', () => {
    vi.mocked(useContainer).mockReturnValue(
      reducedLiveChat as ContainerContextType,
    );
    const { getByTestId } = render(<LiveChat closeLiveChat={closeLiveChat} />);

    expect(getByTestId('live-chat-mobile-close-button')).toHaveClass(
      'xl:hidden',
    );
    expect(getByTestId('live-chat-mobile-open-button')).toHaveClass(
      'xl:hidden',
    );
    expect(getByTestId('live-chat-desktop-open-button')).toHaveClass(
      'hidden xl:flex',
    );
    expect(getByTestId('live-chat-desktop-close-button')).toHaveClass(
      'hidden xl:flex',
    );
  });
});
