export function handleEnterAndEscapeKeyDown({
  onEnter,
  onEscape,
}: {
  onEnter?: () => void;
  onEscape?: () => void;
}) {
  return function (e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      onEnter?.();

      if (e.key === ' ') {
        e.preventDefault(); // Prevent space from scrolling the page
      }
    } else if (e.key === 'Escape') {
      onEscape?.();
    }
  };
}
