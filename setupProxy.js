// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3001', // URL do seu servidor backend local
      changeOrigin: true,
    })
  );
};