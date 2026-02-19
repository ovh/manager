import { useEffect } from 'react';

type ExitGuardProps = {
  active?: boolean;
};

export default function ExitGuard({ active = true }: ExitGuardProps): null {
  useEffect(() => {
    if (!active) return () => {};

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ' ';
    };

    const attach = () =>
      window.addEventListener('beforeunload', handleBeforeUnload);
    const detach = () =>
      window.removeEventListener('beforeunload', handleBeforeUnload);

    attach();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        detach();
        attach();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      detach();
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [active]);

  return null;
}
