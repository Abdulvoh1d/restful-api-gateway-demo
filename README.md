# Relay — RESTful API Gateway demo

A standalone, browser-only API operations dashboard. It presents documentation for fictional sample routes and lets you preview canned JSON responses. This is a UI demo, not a deployed gateway.

## Interactions

- Select one of four documented routes in the sidebar; the method, path, description, example response, and request form update together.
- Choose an HTTP method and edit the path in the request panel. The POST option reveals an editable JSON example body.
- Run a local simulation for `GET /health`, `GET /users`, `POST /users`, `GET /users/usr_101`, or `DELETE /users/:id`. A different route returns a sample 404. Invalid POST JSON returns a sample 400.
- View the simulated status, an approximate browser-side duration, and formatted JSON output.
- Copy a representative cURL command for the current method, path, and (for POST) body.

## Sample boundary and limitations

All displayed endpoint data and simulated responses are sample data. The request runner executes only local JavaScript and makes no API request, network call, write, deletion, or other backend operation. The displayed duration is a small local simulation value, not a measurement of a server. The copied cURL command is illustrative and will not work as a live API request because no gateway or backend is connected.

The reference technology list—Node.js, Express, and Redis—describes a potential full-stack version only. Those technologies are not installed, invoked, or connected by this no-build browser demo. No gateway, database, authentication, persistence, or external integration is provided.

## Launch

Open a terminal in this folder and run:

```sh
python3 -m http.server 8765
```

Then open <http://localhost:8765> in your browser.

The project uses only `index.html`, `styles.css`, and `app.js`; it requires no package manager, framework, external script, font, image, or API.
