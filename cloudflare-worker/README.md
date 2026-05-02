# SodaShip Visitor Counter

GitHub Pages cannot run `/api/visit`, so this endpoint is meant to run as a Cloudflare Worker on the same custom domain.

## How it counts

- `POST /api/visit` increments the total only when the browser does not already have the `sodaship_visitor_counted` cookie.
- The cookie lasts 30 days and is `HttpOnly`, `Secure`, and `SameSite=Lax`.
- `GET /api/visit` returns the current total without incrementing.
- The counter stores one KV value named `sodaship-total-visitors`.

## Cloudflare setup

1. Create a KV namespace named `VISITOR_COUNTER`.
2. Deploy `visitor-counter.js` as a Worker.
3. Bind the KV namespace to the Worker with the variable name `VISITOR_COUNTER`.
4. Add a Worker route for `www.sodaship.com/api/visit*`.

After that, the site footer will show the visitor count automatically.
