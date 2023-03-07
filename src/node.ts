import {
	readdir,
	lstat,
	mkdir,
	symlink
} from 'node:fs/promises'
import {
	createReadStream,
	createWriteStream
} from 'node:fs'
import { pipeline } from 'node:stream'

export async function exists(path: string) {
	try {
		await lstat(path)
		return true
	} catch (error) {
		return false
	}
}

export async function ensureDir(path: string) {
	if (await exists(path)) {
		return
	}
	await mkdir(path, {
		recursive: true
	})
}

export async function copy(src: string, dest: string) {
	if (!(await exists(src))) {
		throw new Error(`src is not exists: ${src}`)
	}

	if (!(await lstat(src)).isDirectory) {
		throw new Error(`src is not dir: ${src}`)
	}

	await ensureDir(dest)

	const entrys = await readdir(src, {
		withFileTypes: true
	})

	await Promise.all(
		entrys.map(entry => {
			const { name } = entry
			const entrySrc = `${src}/${name}`
			const entryDest = `${dest}/${name}`
			if (entry.isDirectory()) {
				return copy(entrySrc, entryDest)
			}
			if (entry.isSymbolicLink()) {
				return symlink(entrySrc, entryDest)
			}

			if (entry.isFile()) {
				return copyFileWithStream(entrySrc, entryDest)
			}
		})
	)

	return
}

export function copyFileWithStream(
	src: string,
	dest: string
) {
	const sourceStream = createReadStream(src)
	const outStream = createWriteStream(dest)
	return new Promise((resolve, reject) => {
		pipeline(sourceStream, outStream, error => {
			if (error) {
				reject(error)
			} else {
				resolve(null)
			}
		})
	})
}
