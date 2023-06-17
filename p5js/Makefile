all: src-compressed-string.base64 index.html

index.html: src-compressed-string.base64 build.js page-structure.html
	node build.js >$@

src-compressed-string.base64: input/
	cat input/* | gzip -9 -c | base64 | tr -d '\n' >$@

clean:
	rm -f src-compressed-string.base64 index.html
