import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function serveMobileZipPlugin(): Plugin {
  return {
    name: 'serve-mobile-zip',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/mobile-deploy-pack.zip')) {
          const zipPath = path.resolve(__dirname, 'public/mobile-deploy-pack.zip');
          if (fs.existsSync(zipPath)) {
            const stat = fs.statSync(zipPath);
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="mobile-deploy-pack.zip"',
              'Content-Length': stat.size,
            });
            fs.createReadStream(zipPath).pipe(res);
            return;
          }
        }
        if (url.startsWith('/api/download-file')) {
          const u = new URL(url, 'http://localhost');
          const fileParam = u.searchParams.get('name') || '';
          let targetPath = '';
          let downloadName = fileParam;
          let contentType = 'text/plain';

          if (fileParam === 'index.html') {
            targetPath = path.resolve(__dirname, 'public/index-mobile.html');
            contentType = 'text/html';
          } else if (fileParam === 'main.js') {
            targetPath = path.resolve(__dirname, 'public/main.js');
            contentType = 'application/javascript';
          } else if (fileParam === 'main.tsx') {
            targetPath = path.resolve(__dirname, 'public/main.tsx');
            contentType = 'text/plain';
          } else if (fileParam === 'main.css') {
            targetPath = path.resolve(__dirname, 'public/main.css');
            contentType = 'text/css';
          } else if (fileParam === 'logo.jpg') {
            targetPath = path.resolve(__dirname, 'public/logo.jpg');
            contentType = 'image/jpeg';
            downloadName = 'status_wala_logo.jpg';
          } else if (fileParam === 'app-icon.png' || fileParam === 'icon.png') {
            targetPath = path.resolve(__dirname, 'public/app-icon.png');
            contentType = 'image/png';
            downloadName = 'status_wala_icon.png';
          }

          if (targetPath && fs.existsSync(targetPath)) {
            const stat = fs.statSync(targetPath);
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${downloadName}"`,
              'Content-Length': stat.size,
            });
            fs.createReadStream(targetPath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveMobileZipPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


