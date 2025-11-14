import {
  Accordion,
  AccordionChangeDetail,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Text,
} from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

export type TCartProduct = {
  title: string;
  designation?: string;
  quantity?: number;
  expanded?: boolean;
};

type TCartProps = {
  products: TCartProduct[];
};

export const GenericCart = ({ products }: TCartProps) => {
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(
    products
      .filter((product) => product.expanded)
      .map((product) => product.title),
  );

  const handleAccordionChange = useCallback(
    (accordion: AccordionChangeDetail) =>
      setExpandedAccordions(accordion.value),
    [setExpandedAccordions],
  );
  const isExpanded = useCallback(
    (accordion: string) => expandedAccordions.includes(accordion),
    [expandedAccordions],
  );

  return (
    <div className="rounded-md border border-solid border-gray-400 shadow-lg p-6">
      <Accordion value={expandedAccordions} onChange={handleAccordionChange}>
        {products.map((product) => (
          <AccordionItem key={product.title} value={product.title}>
            <AccordionTrigger
              className={clsx(
                'border border-gray-200',
                isExpanded(product.title) ? 'rounded-t-lg' : 'rounded-sm',
              )}
            >
              <Text preset="paragraph" className="text-[--ods-color-heading]">
                {product.title.toUpperCase()}
              </Text>
              {product.designation && (
                <Text preset="label" className="text-[--ods-color-heading]">
                  {product.designation}
                </Text>
              )}
            </AccordionTrigger>
            <AccordionContent className="bg-[--ods-color-neutral-050] py-5 px-8">
              {product.quantity && (
                <Text className="text-[--ods-color-heading]">
                  {product.quantity} x
                </Text>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
