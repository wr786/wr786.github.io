.PHONY: github clean build

github: clean build
	@echo "======================================================"
	@echo "deploying to github"
	cd src/.vuepress/dist && \
	git init && \
	git add -A && \
	git commit -m 'deploy at $(shell date)' && \
	git branch -m local-build && \
	git push -f git@github.com:wr786/wr786.github.io.git local-build:gh-pages

clean:
	@echo "======================================================"
	@echo "cleaning up output directory"
	- rm -rf src/.vuepress/dist

build:
	@echo "======================================================"
	@echo "building site"
	npm run docs:build

