# BookWeb

BookWeb is a full-stack second-hand book exchange platform for students. Sellers can upload used books, buyers can browse listings, and contact happens directly through the seller details shown on each listing.

## Stack

- Frontend: React 18, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT stored in an `httpOnly` cookie
- Media: Cloudinary uploads via `multer-storage-cloudinary`

## Setup

1. Create env files from the examples:
   - `cp server/.env.example server/.env`
   - `cp client/.env.example client/.env`
2. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
3. Fill in the required secrets:
   - `server/.env`: `JWT_SECRET`, `MONGO_URI`, `CLIENT_URL`, and Cloudinary keys
   - `client/.env`: `VITE_API_BASE_URL`
4. Start the backend on port `5000`:
   - `cd server && npm run dev`
5. Start the frontend on port `5173`:
   - `cd client && npm run dev`

## Notes

- In local development, keep the frontend and API on the same loopback hostname
  (`127.0.0.1` with `127.0.0.1`, or `localhost` with `localhost`) so the auth
  cookie is sent correctly. The default setup uses `http://127.0.0.1:5000/api`.
- If `MONGO_URI` is left empty, the server falls back to an in-memory MongoDB instance for local development.
- If Cloudinary is not configured, `ALLOW_MOCK_UPLOADS=true` can be used only for local smoke testing.

## Phase 7 Finish

- Friendly React error boundary with recovery actions
- Polished 404 page
- Toast-based feedback retained across auth and CRUD flows
- Loading, retry, and empty-state coverage across core pages
- Environment examples for both apps
# major
