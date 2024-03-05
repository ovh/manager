import { Span } from '@/components/typography';

interface OrderPriceProps {
  price: string;
  tax: string;
}
const OrderPrice = ({price, tax}: OrderPriceProps) => {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <Span>Price</Span>
      <div className="inline-block">
        <Span className='font-bold'>{price} € HT</Span>  
        <Span className="font">({tax} € TTC) /heure</Span>
      </div>
    </div>
  );
};

export default OrderPrice;
