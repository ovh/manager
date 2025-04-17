import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type DrawerOverlayProps = {
  isOpen: boolean;
  onClickOverlay: () => void;
};

export const DrawerOverlay = ({
  isOpen,
  onClickOverlay,
}: DrawerOverlayProps) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  const handleOnClose = () => onClickOverlay?.();

  useEffect(() => {
    // Find or create the portal element
    let element = document.getElementById('overlay-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'overlay-root';
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Prevent scrolling when overlay is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Don't render if the overlay is not open or portalElement is not available
  if (!isOpen || !portalElement) return null;

  // Use portal to render the overlay outside the normal DOM hierarchy
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`absolute inset-0 bg-[#0050d7] bg-opacity-70 `}
        onClick={handleOnClose}
      />
    </div>,
    portalElement,
  );
};
