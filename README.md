# wr786.github.io

Personal site built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

## Local development

Install Go and Hugo Extended, then run:

```bash
hugo server
```

## Update theme manually

```bash
hugo mod get -u github.com/adityatelange/hugo-PaperMod
hugo mod tidy
```

GitHub Actions builds `master` and deploys the generated site to the `gh-pages` branch.
