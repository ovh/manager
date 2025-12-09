const TARGET = 'https://metrics-for-manager.gra.technicalapis.ovh.net';

module.exports = {
  target: TARGET,
  context: ['/api/metrics'],
  changeOrigin: true,
  pathRewrite: {
    '^/api/metrics': '/m4m-single-endpoint-proxy/api/v1',
  },
  secure: false,
  logLevel: 'debug',
  cookieRewrite: true,
  headers: {
    authorization:
      'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IkVGNThFMkUxMTFBODNCREFEMDE4OUUzMzZERTk3MDhFNjRDMDA4MDEiLCJraW5kIjoib2F1dGgyIiwidHlwIjoiSldUIn0.eyJBY2Nlc3NUb2tlbiI6ImI4YzJkNzlkNGQwMDIyNzJlODBiNzA3ZDkyNGI0ZjMzNDliMTQ5YjQ4MGYzZDgyNmJiOTAxMzE0MzMzMGU1NjEiLCJpYXQiOjE3NjUzMTI3NDl9.WzA_Hkaro1jSSK4oYrLYv6i6ei6d-u4qMQ1bVA33yKMdGBj7-C6CLz97yC4yyxlJGRe_0nmuUD2JvYaN35LgAA',
  },
};
