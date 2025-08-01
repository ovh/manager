import { OdsLink } from '@ovhcloud/ods-components/react';

type ClickLinkProps = {
  children?: string;
  onClick: () => void;
};

export default function ClickLink({ children, onClick }: ClickLinkProps) {
  return (
    <OdsLink
      href="#"
      label={children}
      color="primary"
      className="cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    />
  );
}
