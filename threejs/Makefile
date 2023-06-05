all: src-compressed-string.base64 index.html

index.html: src-compressed-string.base64 build.js page-structure.html
	node build.js >$@

src-compressed-string.base64: compressed-inputs/
	cat compressed-inputs/* | gzip -9 -c | base64 >$@

clean:
	rm -f src-compressed-string.base64 index.html
