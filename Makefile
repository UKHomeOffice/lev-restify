.PHONY: all clean deps node-deps publish test unit-test

all: deps test

clean:
	rm -rf node_modules/

deps: node-deps

node-deps: node_modules/

node_modules/: package.json
	npm install

publish:
	npm publish

unit-test: node_modules/
	npm test

test: unit-test
