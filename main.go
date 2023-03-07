package main

import (
	"fmt"
	"os"

	cp "github.com/markthree/fast-cpy/src"
)

func main() {
	cp.Copy(os.Args[1], os.Args[2])

	fmt.Fprintln(os.Stdout, "")
}
