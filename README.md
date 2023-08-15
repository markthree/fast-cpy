# fast-cpy

Recursive concurrent copy, ultrafast

<br />

## README 🦉

[简体中文](./README_CN.md) | English

<br />

## Usage

### install

```shell
npm i fast-cpy
```

### cli

```shell
fast-cpy <src> <dest>
```

### program

```ts
import { copy, copyBin } from "fast-cpy";

await copy("src", "dest"); // Node native stream, supporting large files

await copyBin("src", "dest"); // Use go, suitable for multiple files
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
