import { debug } from './utils';
import { TMS_SCRIPT_URL } from './constants';

// parse visitor id from cookie and return its value
function getVisitorId() {
  const name = 'clientSideUserId';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(
      parts
        .pop()
        .split(';')
        .shift(),
    );
  }
  return '';
}

export function loadManagerTMS(): Promise<{
  getVisitorId: () => string;
  updateVisitorId: (id: string) => void;
}> {
  const element = document.createElement('iframe');
  const id = 'manager-tms-iframe';
  element.setAttribute('id', id);
  element.setAttribute('title', id);
  element.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  element.setAttribute(
    'srcdoc',
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <script src="${TMS_SCRIPT_URL}"></script>
      </body>
    </html>
  `,
  );
  element.style.width = '0px';
  element.style.height = '0px';
  element.style.border = 'none';
  element.style.position = 'absolute';
  element.style.display = 'none';
  return new Promise((resolve, reject) => {
    element.addEventListener(
      'load',
      () =>
        resolve({
          getVisitorId,
          updateVisitorId(clientId = '') {
            debug(`tracking tms update visitor id='${clientId}'`);
            element.contentWindow.postMessage({
              id: 'ClientUserId',
              value: clientId,
            });
          },
        }),
      false,
    );
    element.addEventListener('error', reject, false);
    debug('tracking tms injection');
    document.body.appendChild(element);
  });
}
