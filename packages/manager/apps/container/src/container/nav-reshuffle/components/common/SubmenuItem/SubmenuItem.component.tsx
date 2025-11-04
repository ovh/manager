import React, { ReactNode } from 'react';
import { Link } from '@ovh-ux/muk';

interface SubmenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string | null;
  isHighlighted?: boolean;
  label: string;
  badge?: ReactNode;
}

export const SubmenuItem: React.FC<SubmenuItemProps> = ({
  href,
  isHighlighted = false,
  label,
  badge
}) => {

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <Link
        href={href}
        className={`p-2 gap-0 text-[var(--ods-color-primary-800)] font-normal rounded-md flex-1 ${
          isHighlighted ? 'bg-cyan-100' : ''
        } hover:bg-cyan-100 hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none`}
      >
        <>
          {label}
          {badge}
        </>
      </Link>
    </div>
  );
};
