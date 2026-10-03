import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { defineConfig, Plugin } from 'vite';

function downloadZipPlugin(): Plugin {
  return {
    name: 'download-zip-plugin',
    configureServer(server) {
      server.middlewares.use('/api/download-zip', async (_req, res) => {
        try {
          const zip = new JSZip();
          const rootDir = process.cwd();

          function addDirectory(dir: string) {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
              if (
                item.name === 'node_modules' ||
                item.name === '.git' ||
                item.name === 'dist' ||
                item.name === 'dev-dist' ||
                item.name === '.cache' ||
                item.name === '.vite'
              ) {
                continue;
              }
              const fullPath = path.join(dir, item.name);
              const relPath = path.relative(rootDir, fullPath);
              if (item.isDirectory()) {
                addDirectory(fullPath);
              } else if (item.isFile()) {
                zip.file(relPath, fs.readFileSync(fullPath));
              }
            }
          }

          addDirectory(rootDir);
          const zipBuffer = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
          });

          res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="status-wala-complete-code.zip"',
            'Content-Length': zipBuffer.length,
            'Cache-Control': 'no-cache',
          });
          res.end(zipBuffer);
        } catch (error) {
          console.error('Error generating project ZIP:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to generate project ZIP' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), downloadZipPlugin()],
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

