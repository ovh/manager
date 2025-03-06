import React, { Suspense, useRef, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ConfigoNasHaModule } from '@/types/orderConfigos.type';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

const NasHaComponent = React.lazy(() =>
  import('order_fm/ConfigoNasHa').then((module: ConfigoNasHaModule) => ({
    default: (props: {
      slotRef: React.RefObject<HTMLDivElement>;
    }): JSX.Element => {
      const user = useContext(ShellContext).environment.getUser();
      const setupNasHa: ConfigoNasHaModule['default'] = module.default;
      setupNasHa(props.slotRef.current, {
        options: {
          assets: {
            flagsPath: '/assets/flags',
          },
          orderId: 'nasha',
          usePreprod: false,
          useLab: false,
          subsidiary: user.ovhSubsidiary,
          // language: user.language.substring(0, 2), // in case language is en instead of en_GB
          navbar: {
            enable: true,
          },
          cart: {
            enable: true,
          },
        },
        callbacks: {
          error: () => {},
          ready: () => {},
          update: () => {},
          navigation: () => {},
        },
      });
      return null;
    },
  })),
);

export default function NasHaOrderPage() {
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={slotRef} className="m-10">
      <Breadcrumb />
      <Suspense fallback={<></>}>
        <NasHaComponent slotRef={slotRef} />
      </Suspense>
    </div>
  );
}
