import { Skeleton } from '@datatr-ux/uxlib';

const OrderSkeleton = () => {
  return (
    <div
      data-testid="order-funnel-skeleton"
      className="grid grid-cols-1 lg:grid-cols-4 gap-4"
    >
      <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
        <Skeleton className="w-80 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
        <Skeleton className="w-80 h-8 mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-2">
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
      <Skeleton className="w-full h-[600px]" />
    </div>
  );
};

export default OrderSkeleton;
