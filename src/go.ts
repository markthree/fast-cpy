import { execa } from 'execa'
import {
	arch as _arch,
	platform as _platform
} from 'node:os'

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const _dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: dirname(fileURLToPath(import.meta.url))

let defaultBinPath = ''

export function inferVersion() {
	const platform = _platform()
	if (!/win32|linux|darwin/.test(platform)) {
		throw new Error(`${platform} is not support`)
	}

	const arch = _arch()

	if (!/amd64_v1|arm64|386|x64/.test(arch)) {
		throw new Error(`${arch} is not support`)
	}

	return `${platform === 'win32' ? 'windows' : platform}_${
		arch === 'x64' ? 'amd64_v1' : arch
	}`
}

export function detectBinName(version = inferVersion()) {
	return `fast-cpy${
		version.startsWith('windows') ? '.exe' : ''
	}`
}

export function detectDefaultBinPath() {
	if (defaultBinPath) {
		return defaultBinPath
	}

	const version = inferVersion()
	const name = detectBinName(version)
	defaultBinPath = resolve(
		_dirname,
		`../dist/fast-cpy_${version}/${name}`
	)
	return defaultBinPath
}

interface Options {
	binPath?: string
}

export function copyBin(
	src: string,
	dest: string,
	options: Options = {}
) {
	const { binPath = detectDefaultBinPath() } = options

	return execa(binPath, [src, dest], {
		reject: false
	})
}
