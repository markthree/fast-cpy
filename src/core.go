package core

import (
	"fmt"
	"io"
	"os"
	"path"
	"sync"

	"github.com/panjf2000/ants"
)

var pool, _ = ants.NewPool(1000000)

func Exists(path string) bool {
	_, err := os.Stat(path)
	if err != nil {
		if os.IsExist(err) {
			return true
		}
		return false
	}
	return true
}

func EnsureDir(path string) {
	if Exists(path) {
		return
	}
	err := os.MkdirAll(path, os.ModePerm)
	if err != nil {
		fail(err)
	}
}

func fail(detail error) {
	fmt.Fprintln(os.Stderr, detail)
}

func Copy(src, dest string) {
	srcInfo, err := os.Stat(src)
	if err != nil {
		fail(err)
		return
	}

	if !srcInfo.IsDir() {
		fail(fmt.Errorf("src is not dir: %v", src))
		return
	}

	EnsureDir(dest)

	entrys, err := os.ReadDir(src)

	if err != nil {
		fail(err)
		return
	}

	entrysLen := len(entrys)

	var wg sync.WaitGroup
	wg.Add(entrysLen)

	for i := 0; i < entrysLen; i++ {
		entry := entrys[i]
		pool.Submit(func() {
			defer wg.Done()

			n := entry.Name()
			s := path.Join(src, n)
			d := path.Join(dest, n)

			srcInfo, err := os.Stat(s)

			if err != nil {
				fail(err)
				return
			}

			// dir
			if srcInfo.IsDir() {
				Copy(s, d)
				return
			}

			// symbol link
			if srcInfo.Mode()&os.ModeSymlink != 0 {
				err := os.Symlink(s, d)
				if err != nil {
					fail(err)
				}
				return
			}

			// file
			if srcInfo.Mode().IsRegular() {
				srcFile, err := os.Open(s)
				if err != nil {
					fail(err)
					return
				}
				defer srcFile.Close()

				dstFile, err := os.Create(d)
				if err != nil {
					fail(err)
					return
				}
				defer dstFile.Close()

				io.Copy(dstFile, srcFile)
			}
		})
	}

	wg.Wait()
}
