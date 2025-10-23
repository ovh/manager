export type OrderSummaryProps = {
  onFinish: () => void;
  onClickLink?: () => void;
  orderLink: string;
  productName?: string;
};
