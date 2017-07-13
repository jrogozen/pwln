# Pwln

pwln is an example of a frontend development config extracted out as a repo.

## Getting started

For a more detailed guide, check out this [blog post](https://medium.com/@jonrogozen/setting-up-a-version-controlled-build-repo-1192c84671ff).

Otherwise, browse the source code here and try it out by running

`npm install pwln`

## Config

pwln optionally accepts a `pwln.json` file in project root. You can use this to set the client and server entry points, as well as the aliases you want available when webpack builds

eg:

```
{
    "aliases": {
        "app": "./app",
        "scss": "./scss",
        "shared": "./app/shared",
        "client": "./app/client",
        "server": "./app/server",
        "images": "./app/images",
        "config": "./config",
        "dist": "./dist",
        "public": "./public"
    },
    "entryPoints": {
        "client": "./app/client/index.js",
        "server": "./app/server/index.js"
    },
    "outputPoints": {
        "client": "./dist/client",
        "server": "./dist/server"
    }
}
```

If no `pwln.json` file is found, the above will be used as the default options.

## Usage

After installation, pwln makes a few commands available in package.json scripts

- **pwln-clean**
    - delete and make output folders
- **pwln-build**
    - webpack build once
- **pwlb-dev**
    - webpack watch
