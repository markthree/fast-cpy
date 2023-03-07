package main

import (
	"fmt"
	"os"

	cp "github.com/markthree/fast-cpy/src"
)

func main() {
	cp.Copy(os.Args[0], os.Args[1])

	fmt.Fprintln(os.Stdout, "")
}
