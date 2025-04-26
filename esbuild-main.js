import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

esbuild.build({
  entryPoints: [path.join(__dirname, 'electron', 'main.js')],
  bundle: true,
  outfile: path.join(__dirname, 'dist', 'main.js'),
  platform: 'node',
  target: 'node18',
  format: 'esm',
  external: ['electron']
})
