export const handleEnterAndEscapeKeyDown = ({
  onEnter,
  onEscape,
}: {
  onEnter?: () => void;
  onEscape?: () => void;
}) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    onEnter?.();
  } else if (e.key === 'Escape') {
    onEscape?.();
  }
};
