// pm2 process config for production. Keeps `next start` alive across
// crashes/reboots so the Cloudflare Tunnel always has something to proxy to.
//
// Usage (after `npm run build`):
//   npm install -g pm2
//   pm2 start ecosystem.config.js
//   pm2 save            # persist the process list
//   pm2 startup         # print the OS command to auto-start pm2 on reboot
//
// Re-deploy: git pull && npm ci && npm run build && pm2 reload claws-website

module.exports = {
  apps: [
    {
      name: 'claws-website',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
}
