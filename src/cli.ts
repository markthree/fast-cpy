import mri from "mri";
import consola from "consola";
import { resolve } from "node:path";
import { cyan, gray } from "kolorist";
import { copy, copyBin } from "./index";

const log = consola.withScope("fast-cpy");

function printUsage() {
  console.log(` 	fast-cpy 
	
	Get the size of a folder by recursively iterating through all its sub(files && folders). Use go, so high-speed

	usage:
		fast-cpy [options] <src> <dest>

	options:
		-h, --help            check help
		-c, --cwd             basic path
		-g, --go              use go(default false)\n`);
}

async function main() {
  const _argv = process.argv.slice(2);
  const argv = mri(_argv, {
    default: {
      go: false,
      help: false,
      cwd: process.cwd(),
    },
    boolean: ["go", "help"],
    string: ["cwd"],
    alias: {
      g: ["go"],
      h: ["help"],
      c: ["cwd"],
    },
  });

  if (argv.help) {
    printUsage();
  } else {
    if (argv._.length < 2) {
      log.error(
        "src and dest is required,",
        ` ${cyan("Usage: fast-cpy <src> <dest>")}`,
      );
      return;
    }

    let [src, dest] = argv._;

    src = resolve(argv.cwd, src);
    dest = resolve(argv.cwd, dest);
    if (argv.go) {
      await copyBin(src, dest);
      log
        .withTag("go")
        .success(`copied: ${gray(`${src} -> ${dest}`)}`);
    } else {
      await copy(src, dest);
      log
        .withTag("node")
        .success(`copied: ${gray(`${src} -> ${dest}`)}`);
    }
  }
}

main();
