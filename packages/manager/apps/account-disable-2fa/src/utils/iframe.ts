export type IframeLoaderPayload = {
  src: string;
  id?: string;
  title?: string;
  style?: string;
  width?: string;
};

const getNewIframeElement = (
  payload: IframeLoaderPayload,
): HTMLIFrameElement => {
  if (!payload || !payload.src) {
    throw new Error('[IframeLoader][getNewIframeElement()] missing payload.');
  }

  const iframe = document.createElement('iframe');
  iframe.src = payload.src;

  if (payload.title) {
    iframe.title = payload.title;
  }
  if (payload.width) {
    iframe.width = payload.width;
  }
  if (payload.id) {
    iframe.id = payload.id;
  }
  if (payload.style) {
    iframe.style.cssText = payload.style;
  }

  return iframe;
};

export const loadIframe = (payload: IframeLoaderPayload): Promise<unknown> => {
  const iframe = getNewIframeElement(payload);
  const promise = new Promise((resolve, reject) => {
    iframe.onload = resolve;
    // The following code is never called
    // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#error_and_load_event_behavior
    iframe.onerror = reject;
  });

  document.body.appendChild(iframe);
  return promise;
};

export const removeIframe = (iframe: HTMLIFrameElement): HTMLIFrameElement =>
  document.body.removeChild(iframe);
