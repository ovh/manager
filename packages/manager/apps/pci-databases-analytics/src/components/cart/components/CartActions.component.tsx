import { cn } from '@/lib/utils';

interface CartActionsProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const CartActions = ({ children, className }: CartActionsProps) => (
  <div className={cn('flex p-4', className)}>{children}</div>
);

export default CartActions;
