import { Span } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { displaySizeFormat } from '@/data/constant';
import { Flavor } from '@/models/order-funnel';
import { ai } from '@/models/types';
import {
  Cpu,
  HardDrive,
  Hash,
  MemoryStick,
  Network,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

interface OrderSummaryProps {
  order: {
    name: string;
    labels: {
      name: string;
      value: string;
    };
    price: string;
    tax: string;
    unsecureHttp: boolean;
    framework: ai.notebook.Framework;
    version: string | undefined;
    editor: ai.notebook.Editor;
    region: string;
    flavor: {
      flavor: Flavor | undefined;
      number: number;
    };
  };
  onSectionClicked: (target: string) => void;
}

const FrameworkDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('framework')}
          className="font-bold"
        >
          Framework :
        </Button>
        {order.framework && (
          <>
            <Span>{order.framework.name}</Span>
            {order.framework.logoUrl && (
              <img
                className="block w-9 h-6"
                src={order.framework.logoUrl}
                alt={order.framework.name}
              />
            )}
          </>
        )}
      </div>
      <div className="flex items-start pl-4 gap-2">
        <Hash className="size-4" />
        {order.version ? (
          <Span>Version {order.version}</Span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
    </div>
  );
};

const EditorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('editor')}
          className="font-bold"
        >
          Editor :
        </Button>
        {order.editor && (
          <>
            <Span>{order.editor.name}</Span>
            {order.editor.docUrl && (
              <img
                className="block w-6 h-6"
                src={order.editor.logoUrl}
                alt={order.editor.name}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('region')}
          className="font-bold"
        >
          Region :
        </Button>
        {order.editor && (
          <>
            <Span>{order.region}</Span>
          </>
        )}
      </div>
    </div>
  );
};

const PrivacyDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('privacy')}
          className="font-bold"
        >
          Confidentialité :
        </Button>
        {order.unsecureHttp ? (
          <>
            <ShieldX className="size-4 text-red-500" />
            <Span>Accès public</Span>
          </>
        ) : (
          <>
            <ShieldCheck className="size-4 text-green-600" />
            <Span>Accès privée</Span>
          </>
        )}
      </div>
    </div>
  );
};

const FlavorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="font-bold"
        >
          Ressources :
        </Button>
        {order.flavor ? (
          <>
            <Span className="capitalize">{order.flavor.flavor?.id}</Span>
            <Span className="capitalize">
              {order.flavor.flavor?.gpuInformation?.gpuModel}
            </Span>
          </>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {order.flavor.number && order.flavor.flavor && (
        <>
          <div className="flex items-start pl-4 gap-2">
            <Cpu className="size-4" />
            <Span>
              {order.flavor.number * order.flavor.flavor.resourcesPerUnit.cpu}{' '}
              vCores
            </Span>
          </div>
          <div className="flex items-start pl-4 gap-2">
            <MemoryStick className="size-4" />
            <Span>
              {displaySizeFormat(
                Number(
                  order.flavor.number *
                    order.flavor.flavor.resourcesPerUnit.memory,
                ),
                false,
                0,
              )}{' '}
              RAM
            </Span>
          </div>
          <div className="flex items-start pl-4 gap-2">
            <HardDrive className="size-4" />
            <Span>
              {displaySizeFormat(
                order.flavor.number *
                  order.flavor.flavor.resourcesPerUnit.ephemeralStorage,
                false,
                0,
              )}{' '}
              SSD
            </Span>
          </div>
          <div className="flex items-start pl-4 gap-2">
            <Network className="size-4" />
            <Span>
              {displaySizeFormat(
                order.flavor.number *
                  order.flavor.flavor.resourcesPerUnit.publicNetwork,
                true,
                2,
              )}
              /s
            </Span>
          </div>
        </>
      )}
    </div>
  );
};

const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {/* <NameDetails order={order} /> */}
      <FrameworkDetails order={order} onSectionClicked={onSectionClicked} />
      <EditorDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <PrivacyDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      {/*
        <SSH Key  order={order} onSectionClicked={onSectionClicked} />
        <Volume order={order} onSectionClicked={onSectionClicked} />
        */}
    </div>
  );
};

export default OrderSummary;
