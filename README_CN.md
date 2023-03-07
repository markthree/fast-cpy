# fast-cpy

递归并发复制，超级快

<br />

## README 🦉

简体中文 | [English](./README.md)

<br />

## Usage

### install

```shell
npm i fast-cpy
```

### program

```ts
import { copy, copyBin } from 'fast-cpy'

await copy('src', 'dest') // node 原生流，支持大文件

await copyBin('src', 'dest') // 使用 go，适合并发多文件
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
