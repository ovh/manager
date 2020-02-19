import RFB from '@novnc/novnc';

import {
  STATUS_CONNECTING,
  STATUS_CONNECTED,
  STATUS_DISCONNECTED,
} from './novnc.constants';

export default class DedicatedVpsKVMNoVNCController {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  $onInit() {
    this.connected = false;
    this.status = STATUS_CONNECTING;

    const rfbUrl = `wss://${this.host}:${this.port}/`;

    const rfbConfig = {
      credentials: {
        password: this.password,
      },
      wsProtocols: ['binary', 'base64'],
      shared: true,
      repeaterID: '',
    };

    this.rfb = new RFB(
      document.getElementById('noVNC_screen'),
      rfbUrl,
      rfbConfig,
    );

    this.rfb.addEventListener('connect', () => {
      this.rfb.background = '#000';
      this.$timeout(() => {
        this.connected = true;
        this.status = STATUS_CONNECTED;
      });
    });

    this.rfb.addEventListener('disconnect', () => {
      this.$timeout(() => {
        this.connected = false;
        this.status = STATUS_DISCONNECTED;
      });
    });

    this.rfb.addEventListener('desktopname', ({ detail: { name } }) => {
      this.$timeout(() => {
        this.desktopName = name;
      });
    });
  }

  sendCtrlAltDel() {
    this.rfb.sendCtrlAltDel();
  }

  $onDestroy() {
    if (this.rfb) {
      this.rfb.disconnect();
    }
  }
}
