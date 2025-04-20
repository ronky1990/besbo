module.exports = {
  devServer: {
    allowedHosts: ['localhost', '.localhost', '127.0.0.1'],
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5678',
        changeOrigin: true,
      },
    },
  },
}; 