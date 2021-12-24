import React, { useContext, useEffect, useRef, useState } from 'react';

import { plugin, IFrameMessageBus, UxModal } from '@ovh-ux/shell';

import ApplicationContext from '../context';

import ShellHeader from './header';
import style from './shell.module.scss';

function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const { shell } = useContext(ApplicationContext);

  useEffect(() => {
    const template = document.getElementById(
      'manager-cookie-policy-banner-modal',
    );
    const modalContent = document.importNode(template, true).firstElementChild;

    const modalContentObj = new UxModal({
      content: modalContent,
      size: 'lg',
      className: 'manager-cookie-policy-banner',
    }).show();

    modalContent.querySelector('button').onclick = () => {
      modalContentObj.hide();
    };
  }, []);

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  useEffect(() => {
    const routing = plugin.routing.initRouting(iframeRef.current);
    shell.registerPlugin('routing', routing);
    setRouter(routing.router);
  }, [iframeRef, shell]);

  return (
    <div className={style.managerShell}>
      {router}
      <div className={style.managerShell_header}>
        <ShellHeader />
      </div>
      <div className={style.managerShell_content}>
        <iframe
          label="app"
          role="document"
          src="about:blank"
          ref={iframeRef}
        ></iframe>
      </div>
      <div className={style.managerShell_footer}></div>
      <template id="manager-cookie-policy-banner-modal">
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            pulvinar iaculis sem, sodales imperdiet tortor sagittis vel. Integer
            vulputate eu ligula ut placerat. Proin suscipit tincidunt velit, non
            tristique turpis sodales euismod. Etiam vel arcu eget metus dapibus
            facilisis. Maecenas venenatis congue sagittis. Sed facilisis
            ultricies felis eu elementum. Praesent dictum mauris a nulla
            maximus, sed convallis turpis efficitur.
          </p>
          <p>
            Vivamus congue congue sapien, vehicula maximus mauris porta mattis.
            Nullam sit amet enim eget odio ultrices gravida accumsan eu arcu.
            Nunc condimentum diam enim, dapibus interdum velit posuere et. Nulla
            facilisi. Etiam in fringilla nunc. Curabitur aliquam erat eu neque
            sagittis, quis tempus neque condimentum. Vivamus sit amet mi
            euismod, suscipit felis ut, rutrum arcu. Nam congue sapien vitae
            egestas sagittis. Praesent ipsum lorem, aliquam in enim id, lacinia
            pretium ligula. Duis ac ligula et elit dapibus varius. Integer
            congue ex sed purus malesuada molestie.
          </p>
          <p>
            Sed vehicula fermentum dui sit amet facilisis. Donec bibendum
            pulvinar purus, et volutpat sem finibus sed. Phasellus vitae justo
            tincidunt nibh hendrerit dictum. Ut a sapien quis elit fringilla
            condimentum. Vestibulum neque sem, molestie eget dignissim nec,
            suscipit in tortor. Curabitur non libero neque. Pellentesque vitae
            pharetra sem. Praesent eu odio ut elit condimentum commodo.
            Pellentesque ac convallis sem, quis vehicula ipsum. Morbi quis leo
            eros. Donec accumsan purus et augue sollicitudin malesuada.
          </p>
          <p>
            Nam lorem ligula, suscipit non massa et, sollicitudin iaculis
            libero. Phasellus sit amet sodales urna, ac mollis velit. Cras nec
            risus et velit tincidunt eleifend. Etiam dictum pulvinar vehicula.
            Vivamus velit magna, posuere vitae ipsum a, fermentum luctus odio.
            Praesent posuere suscipit est ac rutrum. Suspendisse quam mauris,
            elementum in odio eget, convallis volutpat quam. Morbi at feugiat
            diam. Sed sed tellus et justo dapibus ultrices. Vestibulum gravida
            commodo ligula, sed tincidunt leo elementum ac. In hac habitasse
            platea dictumst. Pellentesque augue tellus, interdum non imperdiet
            sit amet, auctor sed diam.
          </p>
          <p>
            Maecenas ac ante in nulla maximus mollis. In et nisl eu est mollis
            ultricies nec nec nisl. Aenean ac convallis odio, in aliquam augue.
            Fusce fermentum odio id orci iaculis, at euismod neque porta. Sed
            condimentum, urna ac rhoncus iaculis, risus mauris feugiat metus,
            non consequat ante dui nec orci. Sed quis nibh luctus, venenatis
            dolor a, iaculis urna. Quisque tincidunt dictum pulvinar. Nunc at
            nunc pulvinar leo egestas consequat eu vitae orci.
          </p>
          <div className="manager-cookie-policy-banner">
            <button className="oui-button">Close</button>
          </div>
        </div>
      </template>
    </div>
  );
}

export default Shell;
