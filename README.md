# Client

Angular client for https://github.com/oatmonster/Better-Search-Server

For production builds, add the file `src/environments/environment.prod.ts` with the contents:
```
export const environment = {
  production: true,
  baseUrl: <your server url>/api,
};

```