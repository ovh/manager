import { QueryClientWrapper } from './QueryClientWrapper';
import { HashRouterWithLocationWrapper } from './RouterWithLocationWrapper';

export const RouterWithQueryClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientWrapper>
    <HashRouterWithLocationWrapper>{children}</HashRouterWithLocationWrapper>
  </QueryClientWrapper>
);
