export default function IframeHmrPlugin() {
  return {
    name: 'iframe-hmr',
    handleHotUpdate({ server, modules }) {
      server.ws.send({
        type: 'custom',
        event: 'iframe-reload',
        data: {},
      });
      return modules;
    },
  };
}
