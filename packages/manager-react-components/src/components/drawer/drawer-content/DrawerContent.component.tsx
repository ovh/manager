import { PropsWithChildren } from 'react';

export const DrawerContent = ({ children }: PropsWithChildren) => {
  return (
    <section className="px-6 flex-1 overflow-y-auto outline-none">
      {children}
    </section>
  );
};
