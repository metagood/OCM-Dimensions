all: src-compressed-string.base64 index.html index.local.html

index.html: src-compressed-string.base64 build.js page-structure.html
	node build.js >$@

index.local.html: src-compressed-string.base64 build.js page-structure.html
	node build.js --base-url https://ordinals.com >$@

src-compressed-string.base64: compressed-inputs/
	cat compressed-inputs/* | gzip -9 -c | base64 | tr -d '\n' >$@

clean:
	rm -f src-compressed-string.base64 index.html index.local.html
