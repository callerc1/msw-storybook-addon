<p align="center">
  <img src="https://msw-sb.vercel.app/logo.png" width="200">
</p>
<h1 align="center">MSW Storybook Addon</h1>

## Features

- Mock Rest and GraphQL requests right inside your story.
- Document how a component behaves in various scenarios.
- Get a11y, snapshot and visual tests using other addons for free.

[Full Documentation](https://msw-sb.vercel.app/)

## Quick Start

#### Install msw & storybook addon.

```sh
npm i -D msw msw-storybook-addon
```

#### Enable msw on storybook by adding these lines in `./storybook/preview.js`

```js
import { addDecorator } from '@storybook/react'
import { initializeWorker, mswDecorator } from 'msw-storybook-addon'

initializeWorker()
addDecorator(mswDecorator)
```

#### Generate service worker for msw in your public folder.

```sh
npx msw init public/
```

Refer [MSW official guide](https://mswjs.io/docs/getting-started/integrate/browser) for framework specific paths.

#### Start storybook with that public folder.

```sh
npx start-storybook -s public -p 6006
```

#### Mock API calls in a story.

```js
import { rest } from 'msw'

export const SuccessBehavior = () => <UserProfile />

SuccessBehavior.parameters = {
  msw: [
    rest.get('/user', (req, res, ctx) => {
      return res(
        ctx.json({
          firstName: 'Neil',
          lastName: 'Maverick',
        })
      )
    }),
  ],
}
```

_Deprecated_

The msw parameter takes an array of handlers as shown in [MSW official guide](https://mswjs.io/docs/getting-started/mocks/rest-api).

**Updated**

The msw parameter is an object with a property named handlers. This is commonly an array of handlers.

The handlers property can also be an object where the keys are either arrays of handlers or a handler itself. This enables you to inherit (and optionally overwrite/disable) handlers from preview.js parameters.

```js
//preview.js
export const parameters = {
    msw: {
        handlers: {
            auth: [
                rest.get('/login', (req, res, ctx) => {
                    return res(
                        ctx.json({
                            success: true,
                        })
                    )
                }),
                rest.get('/logout', (req, res, ctx) => {
                    return res(
                        ctx.json({
                            success: true,
                        })
                    )
                }),
            ],
        }
    }
};


// This story will include the auth handlers from preview.js
SuccessBehavior.parameters = {
  msw: {
      handlers: {
          profile: rest.get('/profile', (req, res, ctx) => {
              return res(
                  ctx.json({
                      firstName: 'Neil',
                      lastName: 'Maverick',
                  })
              )
          }),
      }
  }
}

// This story will overwrite the auth handlers from preview.js
FailureBehavior.parameters = {
    msw: {
        handlers: {
            auth: rest.get('/login', (req, res, ctx) => {
                return res(ctx.status(403))
            }),
        }
    }
}

// This story will disable the auth handlers from preview.js
NoAuthBehavior.parameters = {
    msw: {
        handlers: {
            auth: null,
            others: [
                rest.get('/numbers', (req, res, ctx) => {
                    return res(ctx.json([1, 2, 3]))
                }),
                rest.get('/strings', (req, res, ctx) => {
                    return res(ctx.json(['a', 'b', 'c']))
                }),
            ],
        }
    }
}
```
