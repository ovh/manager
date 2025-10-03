
import storages from "@/types/Storages";
import { RadioGroup, RadioGroupItem, Label, RadioTile, Badge, Separator } from "@datatr-ux/uxlib";
import React from "react";

interface ConatainerTypeStepProps {
  value?: string;
  onChange?: (newValue: string) => void;
}
const ContainerTypeStep = React.forwardRef<HTMLInputElement, ConatainerTypeStepProps>(
  ({ value, onChange }, ref) => {
    return (
      <RadioGroup
        data-testid="offer-select-container"
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
        value={value}
        onValueChange={onChange}
      >
        <RadioTile
          data-testid="offer-radio-tile-s3-api"
          value={storages.TypeEnum.static}
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-between w-full">
              <h5>Static hosting</h5>
            </div>
            <Separator className="my-2" />
            <div className="text-xs flex-1 flex flex-col">
              Quick and efficient access for your websites. Link your domains and upload your files.
            </div>
          </div>
        </RadioTile>

        <RadioTile
          data-testid="offer-radio-tile-s3-api"
          value={storages.TypeEnum.private}
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-between w-full">
              <h5>Private</h5>
            </div>
            <Separator className="my-2" />
            <div className="text-xs flex-1 flex flex-col">
              Billing, legal information, logs. Archive it simply, in a way that suits you.
            </div>
          </div>
        </RadioTile>

        <RadioTile
          data-testid="offer-radio-tile-s3-api"
          value={storages.TypeEnum.public}
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-between w-full">
              <h5>Public</h5>
            </div>
            <Separator className="my-2" />
            <div className="text-xs flex-1 flex flex-col">
              Multimedia, binaries, e-commerce. Store an enormous amount of data.
            </div>
          </div>
        </RadioTile>

      </RadioGroup>
    );
  },
);


ContainerTypeStep.displayName = 'ContainerTypeStep';
export default ContainerTypeStep;