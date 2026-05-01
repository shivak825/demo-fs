# Shiva K Portfolio

A modern React portfolio site with social links for CodeChef, LinkedIn, and GitHub.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy on Render

1. Create a new **Web Service** on Render from this GitHub repo.
2. Set the build command to `npm install && npm run build`.
3. Set the start command to `npm start`.
4. Add environment variables for your external MySQL database:
	- `DB_HOST`
	- `DB_PORT`
	- `DB_USER`
	- `DB_PASSWORD`
	- `DB_NAME`
	- `DB_SSL` if your provider requires TLS
5. Keep `render.yaml` in the repo for blueprint deploys.
