import { copyBin, copy } from './npm/index.mjs'

console.time('copyBin')

await copyBin('dist', 'dest/copyBin')

console.timeEnd('copyBin')

console.time('copy')

await copy('dist', 'dest/copy')

console.timeEnd('copy')
