import { DevServer } from 'immaculata/dev-server.js'
import { generateFiles } from 'immaculata/file-generator.js'
import { FileTree } from 'immaculata/filetree.js'
import * as hooks from 'immaculata/hooks.js'
import type { } from 'immaculata/jsx-strings-html.js'
import type { } from 'immaculata/jsx-strings.js'
import { registerHooks } from 'module'
import ts from 'typescript'
import { fileURLToPath } from 'url'


const tree = new FileTree('site', import.meta.dirname)
registerHooks(tree.moduleHooks())
registerHooks(hooks.tryAltExts)
registerHooks(hooks.mapImport('react/jsx-runtime', 'immaculata/jsx-strings.js'))
registerHooks(hooks.compileJsx(compileViaTsc))

if (process.argv[2] === 'dev') {
  const server = new DevServer(8080, {})
  server.notFound = (url) => '/404.html'
  server.files = await processSite()

  tree.watch().on('filesUpdated', async (paths) => {
    try { server.files = await processSite() }
    catch (e) { console.error(e) }
    server.reload()
  })
}
else {
  generateFiles(await processSite())
}

async function processSite() {
  console.log('Rebuilding...')
  const start = Date.now()

  const mod = await import("./site/build.js")
  const result = mod.processSite(tree)

  console.log(`Time: ${Date.now() - start} ms`)

  return result
}

function compileViaTsc(str: string, url: string) {
  return ts.transpileModule(str, {
    fileName: fileURLToPath(url),
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      sourceMap: true,
      inlineSourceMap: true,
      inlineSources: true,
    }
  }).outputText
}
