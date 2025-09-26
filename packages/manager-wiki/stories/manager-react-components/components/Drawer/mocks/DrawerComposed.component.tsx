import React from 'react';
import { Drawer } from '@ovh-ux/manager-react-components';

export type DrawerComposedProps = Drawer.RootProps &
  Drawer.HeaderProps &
  Drawer.FooterProps & {
    content: React.ReactNode;
  };

export const DrawerComposed = (props: DrawerComposedProps) => {
  return (
    <Drawer.Root isOpen={props.isOpen} onDismiss={props.onDismiss}>
      <Drawer.Header title={props.title} />
      <Drawer.Content>{props.content}</Drawer.Content>
      <Drawer.Footer
        primaryButtonLabel={props.primaryButtonLabel}
        onPrimaryButtonClick={props.onPrimaryButtonClick}
        secondaryButtonLabel={props.secondaryButtonLabel}
        onSecondaryButtonClick={props.onSecondaryButtonClick}
      />
    </Drawer.Root>
  );
};

export const DrawerCollapsibleComposed = (props: DrawerComposedProps) => {
  return (
    <Drawer.RootCollapsible isOpen={props.isOpen} onDismiss={props.onDismiss}>
      <Drawer.Header title={props.title} />
      <Drawer.Content>{props.content}</Drawer.Content>
      <Drawer.Footer
        primaryButtonLabel={props.primaryButtonLabel}
        onPrimaryButtonClick={props.onPrimaryButtonClick}
        secondaryButtonLabel={props.secondaryButtonLabel}
        onSecondaryButtonClick={props.onSecondaryButtonClick}
      />
    </Drawer.RootCollapsible>
  );
};
