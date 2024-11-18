if (import.meta.hot) {
  import.meta.hot.on('iframe-reload', () => {
    window.location.reload();
  });
}
