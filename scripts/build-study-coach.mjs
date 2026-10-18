import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// A portable copy of the coach: no backend, remote assets, or sign-in required.
const result = await build({
  stdin: { contents: `import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ThemeProvider } from './src/theme/ThemeContext.jsx';
    import StudyCoach from './src/components/features/StudyCoach.jsx';
    createRoot(document.getElementById('root')).render(<ThemeProvider><StudyCoach onClose={() => { window.location.reload(); }} /></ThemeProvider>);`,
    resolveDir: process.cwd(), sourcefile: 'standalone-coach.jsx', loader: 'jsx' },
  bundle: true, minify: true, write: false, outfile: 'coach.js', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
});
const js = result.outputFiles.find(f => f.path.endsWith('.js')).text.replaceAll('</script', '<\\/script');
const css = result.outputFiles.find(f => f.path.endsWith('.css'))?.text || '';
const destination = path.resolve('dist/fluoropath-study-coach.html');
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F8F9FA"><title>FluoroPath Study Coach</title><style>body{margin:0}*{box-sizing:border-box}${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);
console.log(`Portable study coach written to ${destination}`);
