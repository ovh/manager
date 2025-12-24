export const handleEnterAndEscapeKeyDown =
  ({ onEnter, onEscape }: { onEnter?: () => void; onEscape?: () => void }) =>
  (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      onEnter?.();
    } else if (e.key === 'Escape') {
      onEscape?.();
    }
  };
