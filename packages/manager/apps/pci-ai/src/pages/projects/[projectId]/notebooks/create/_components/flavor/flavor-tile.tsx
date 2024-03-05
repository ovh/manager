import RadioTile from '@/components/radio-tile';
import { H5, P } from '@/components/typography';
import { ConvertPricing, displaySizeFormat } from '@/data/constant';
import { Flavor } from '@/models/order-funnel';
import { ai } from '@/models/types';
//import { useTranslation } from 'react-i18next';

export const FlavorTile = ({
  quantity,
  flavor,
  selected,
  onChange,
}: {
  quantity: number 
  flavor: Flavor;
  selected: boolean;
  onChange: (flavor: string, number: number) => void;
}) => {
  //const { t } = useTranslation('pci-databases-analytics/components/engine');
  const handleFlavorClick = () => {
    onChange(flavor.id, 1);
  };
  return (
    <RadioTile
      name="engine-select"
      onChange={handleFlavorClick}
      value={flavor.id}
      checked={selected}
    >
      <H5 className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}>
        {flavor.id}
      </H5>
      {flavor.type === ai.capabilities.FlavorTypeEnum.gpu ? (
        <div>
          <P>{quantity} x {flavor.description}</P>
          <P>
            {quantity} x {displaySizeFormat(flavor.gpuInformation?.gpuMemory, false, 0)}{' '}
            RAM
          </P>
        </div>
      ) : (
        <p>Model: {flavor.description}</p>
      )}
      <RadioTile.Separator />
      <div className="text-xs">
        <P>CPU: {quantity * flavor.resourcesPerUnit.cpu} vCores</P>
        <P>
          RAM:{' '}
          {displaySizeFormat(
            Number(quantity * flavor.resourcesPerUnit.memory),
            false,
            0,
          )}
        </P>
        <P>
          Temporary local storage:{' '}
          {displaySizeFormat(
            quantity * flavor.resourcesPerUnit.ephemeralStorage,
            false,
            0,
          )}{' '}
          SSD
        </P>
        <P>
          Public Network:{' '}
          {displaySizeFormat(
            quantity * flavor.resourcesPerUnit.publicNetwork,
            true,
            2,
          )}
          /s
        </P>

        <RadioTile.Separator />
        <P className="text-xs">
          Ressource Price{' '}
          <strong>€{ConvertPricing(flavor.pricing, false, quantity)} ex. VAT/hour</strong>
        </P>
        <P className="text-xs">
          (€{ConvertPricing(flavor.pricing, true, quantity)} incl. VAT)
        </P>
      </div>
    </RadioTile>
  );
};

export default FlavorTile;
