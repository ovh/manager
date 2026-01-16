import { cn } from '@/lib/utils';

interface CartProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const Cart = ({ children, className }: CartProps) => (
  <div
    className={cn(
      'rounded-md border border-solid border-gray-400 shadow-lg p-4',
      className,
    )}
  >
    {children}
  </div>
);

export default Cart;
