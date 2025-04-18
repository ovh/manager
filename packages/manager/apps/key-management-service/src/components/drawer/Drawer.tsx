import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  PropsWithChildren,
} from 'react';
import { OdsDrawer } from '@ovhcloud/ods-components/react';
import { DrawerOverlay } from './DrawerOverlay';

type DrawerPosition = 'right' | 'bottom' | 'left' | 'top';

type DrawerProps = PropsWithChildren & {
  position?: DrawerPosition;
  onClose?: () => void;
};

type DrawerHandle = {
  toggle: () => void;
  open: () => void;
  close: () => void;
};

type HTMLOdsDrawerElement = HTMLElement & {
  open: () => Promise<void>;
  close: () => Promise<void>;
  isOpen: boolean;
  position: DrawerPosition;
  componentOnReady: () => Promise<HTMLOdsDrawerElement>;
};

export const Drawer = forwardRef<DrawerHandle, DrawerProps>(
  ({ children, position = 'right', onClose }, ref) => {
    const drawerRef = useRef<HTMLOdsDrawerElement>(null);
    const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);

    const handleOpen = () => drawerRef.current?.open();

    const handleClose = () => drawerRef.current?.close();

    useImperativeHandle(ref, () => ({
      toggle: () => {
        if (drawerRef.current?.isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      },
      open: handleOpen,
      close: handleClose,
    }));

    // Handle the overlay visibility
    useEffect(() => {
      const showOverlay = () => setIsOverlayVisible(true);
      const hideOverlay = () => setIsOverlayVisible(false);
      drawerRef.current?.addEventListener('odsOpen', showOverlay);
      drawerRef.current?.addEventListener('odsClose', hideOverlay);
      return () => {
        drawerRef.current?.removeEventListener('odsOpen', showOverlay);
        drawerRef.current?.removeEventListener('odsClose', hideOverlay);
      };
    }, [drawerRef.current]);

    // Set drawer width
    useEffect(() => {
      if (drawerRef.current) {
        const { shadowRoot } = drawerRef.current;
        if (shadowRoot) {
          const dialogElement = shadowRoot.querySelector('dialog');
          if (dialogElement) {
            dialogElement.style.setProperty('width', '800px');
          }
        }
      }
    }, [drawerRef.current]);

    return (
      <>
        <OdsDrawer ref={drawerRef} position={position}>
          {children}
        </OdsDrawer>
        <DrawerOverlay isOpen={isOverlayVisible} onClickOverlay={handleClose} />
      </>
    );
  },
);

Drawer.displayName = 'Drawer';
