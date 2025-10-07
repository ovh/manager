export type DrawerFooterProps = {
  /** Primary Button */
  primaryButton?: {
    /** Label of the button */
    label?: string;
    /** Loading state for the button */
    isLoading?: boolean;
    /** Disabled state for the button */
    isDisabled?: boolean;
    /** Callback for the button */
    onClick?: () => void;
  };
  /** Secondary Button */
  secondaryButton?: {
    /** Label of the button */
    label?: string;
    /** Loading state for the button */
    isLoading?: boolean;
    /** Disabled state for the button */
    isDisabled?: boolean;
    onClick?: () => void;
  };
};
