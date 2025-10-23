import React from 'react';
import { Drawer } from '@ovh-ux/muk';

export type DrawerComposedProps = Drawer.RootProps &
  Drawer.HeaderProps &
  Drawer.FooterProps & {
    content: React.ReactNode;
  };

export const DrawerComposed = (props: DrawerComposedProps) => {
  const { primaryButton, secondaryButton } = props;
  return (
    <Drawer.Root isOpen={props.isOpen} onDismiss={props.onDismiss}>
      <Drawer.Header title={props.title} />
      <Drawer.Content>{props.content}</Drawer.Content>
      <Drawer.Footer
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />
    </Drawer.Root>
  );
};

export const DrawerCollapsibleComposed = (props: DrawerComposedProps) => {
  const { primaryButton, secondaryButton } = props;
  return (
    <Drawer.RootCollapsible isOpen={props.isOpen} onDismiss={props.onDismiss}>
      <Drawer.Header title={props.title} />
      <Drawer.Content>{props.content}</Drawer.Content>
      <Drawer.Footer
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />
    </Drawer.RootCollapsible>
  );
};
