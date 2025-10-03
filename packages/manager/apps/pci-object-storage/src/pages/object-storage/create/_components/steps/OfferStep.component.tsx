import { Badge, RadioGroup, RadioTile, Separator } from "@datatr-ux/uxlib";
import React from "react";
import { ObjectContainerOffers } from "../orderFunnel.const";

interface OfferStepProps {
  value?: ObjectContainerOffers;
  onChange?: (newValue: ObjectContainerOffers) => void;
}

const OfferStep = React.forwardRef<HTMLInputElement, OfferStepProps>(
  ({ value, onChange }, ref) => {
    // TODO: fetch from feature availability
    const hasStandardInfrequentAccess = true;
    return (
      <>
        <RadioGroup
          data-testid="offer-select-container"
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
          value={value}
          onValueChange={onChange}
        >
          <RadioTile
            data-testid="offer-radio-tile-s3-api"
            value={ObjectContainerOffers["s3-standard"]}
          >
            <div className="flex h-full flex-col">
              <div className="flex justify-between w-full">
                <h5>API compatible S3</h5>
                <div>
                  <Badge
                    data-testid={`offer-tile-badge-recommended`}
                    variant={"info"}
                    className="text-xs h-4"
                  >
                    Recommandée
                  </Badge>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="text-xs flex-1 flex flex-col">
                Un large éventail de fonctionnalités compatibles avec S3. Disponible en 1-AZ, 3-AZ et en Local Zones à travers différentes classes de stockage.
              </div>
              {/* <Separator className="my-2" />
              <div className="text-xs">
                <b>À partir de 7,27 € HT/mois/To**</b> (pour la classe de stockage Standard)
              </div> */}
            </div>
          </RadioTile>

          <RadioTile
            data-testid="offer-radio-tile-swift-api"
            value={ObjectContainerOffers.swift}
          >
            <div className="flex h-full flex-col">
              <div className="flex justify-between w-full">
                <h5>Swift API</h5>
              </div>
              <Separator className="my-2" />
              <div className="text-xs flex-1 flex flex-col">
                Solution basique pour le stockage sans besoin particulier en matière de performance. Il s'agit du stockage objet natif d'OpenStack, avec les API Swift.
              </div>
              {/* <Separator className="my-2" />
              <div className="text-xs">
                <b>À partir de 11,21 € HT/mois/To**</b> (pour la classe de stockage Standard)
              </div> */}
            </div>
          </RadioTile>

        </RadioGroup>
        {/* <div className="text-xs mt-2 italic">
          ** Le prix affiché est une estimation pour 1 To d'Object Storage Standard pour 730 heures. Pour plus d'informations,
          voir la page des prix.
        </div> */}
      </>
    );
  },
);

OfferStep.displayName = 'OfferStep';
export default OfferStep;