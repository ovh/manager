import RadioTile from '@/components/radio-tile';
import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

interface PrivacySelectProps {
  onChange: (newPrivacySettings: boolean) => void;
}

const PrivacySelect = React.forwardRef<HTMLInputElement, PrivacySelectProps>(
  ({ onChange }, ref) => {
    const [unsecureHttp, setUnsecureHttp] = useState(false);
    const handleChange = (newAccess: boolean) => {
      setUnsecureHttp(newAccess);
      onChange(newAccess);
    };

    return (
      <div ref={ref}>
        <div className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <RadioTile
            name="privacyType-select"
            onChange={() => handleChange(false)}
            //value={1}
            checked={unsecureHttp === false}
          >
            <div className="flex justify-between items-center">
              <h3
                className={`capitalize ${
                  !unsecureHttp ? 'font-bold' : 'font-normal'
                }`}
              >
                Accès restreint
              </h3>
            </div>
            <RadioTile.Separator />
            <p className="text-xs">
              L’accès à votre notebook est réservé aux utilisateurs Public Cloud
              OVHcloud créés dans votre projet.
            </p>
          </RadioTile>
          <RadioTile
            name="privacyType-select"
            onChange={() => handleChange(true)}
            //value={0}
            checked={unsecureHttp === true}
          >
            <div className="flex justify-between items-center">
              <h3
                className={`capitalize ${
                  unsecureHttp ? 'font-bold' : 'font-normal'
                }`}
              >
                Accès public
              </h3>
            </div>
            <RadioTile.Separator />
            <p className="text-xs">
              Votre notebook est accessible à tout le monde grâce à votre URL.
              N’importe qui peut accéder à votre code et aux données qui y sont
              attachées.
            </p>
            <RadioTile.Separator />
            <div className="flex flex-row gap-2 items-center text-red-500">
              <AlertTriangle className="w-3 h-3" />
              <p className="text-xs">Soyez prudent·e avec les données sensibles.</p>
            </div>
          </RadioTile>
        </div>
      </div>
    );
  },
);

export default PrivacySelect;
