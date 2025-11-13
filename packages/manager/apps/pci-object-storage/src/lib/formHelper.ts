export const withPreventDefault = (handler: () => void) => (
  e?: React.FormEvent,
) => {
  e?.preventDefault();
  e?.stopPropagation();
  handler();
};
