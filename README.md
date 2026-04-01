# 💍 BandhanBD — Client

> Bangladesh's trusted matrimonial platform. Browse thousands of verified biodata profiles, connect with your ideal match, and share your success story.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-11.2-FFCA28?logo=firebase)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)](https://stripe.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)

---

## 🌐 Live Demo

| Resource | URL |
|---|---|
| 🖥️ Live Site | [https://bandhanbd.web.app](https://bandhanbd.web.app) |
| 🔧 Server API | [https://bandhan-bd-server.vercel.app](https://bandhan-bd-server.vercel.app) |

---

## ✨ Key Features

1. **Homepage** — Hero banner, 6 premium member cards (sortable by age), How It Works section, animated success counters, and success stories sorted by marriage date
2. **Browse Biodatas** — Paginated biodata listing (20 per page) with filters for age range, gender, and division
3. **Biodata Details** — Full profile view with 3 similar biodatas; contact info hidden for non-premium users
4. **Firebase Authentication** — Email/password registration with profile photo upload, Google OAuth, and JWT-based session persistence across page refreshes
5. **Create & Edit Biodata** — 20-field biodata form with auto-calculated age from date of birth and image upload via ImgBB
6. **View My Biodata** — Read-only profile view with "Request Premium Status" button triggering admin approval workflow
7. **Favourites** — Save and manage favourite biodata profiles from a dedicated dashboard table
8. **Stripe Payment** — Secure $5 USD card payment to request contact information for a specific biodata
9. **My Contact Requests** — Track all contact requests; approved requests reveal mobile and email of the profile
10. **Got Married Form** — Submit a success story with couple photo, marriage date, star rating, and story text
11. **Admin Dashboard** — KPI cards + pie chart showing total/male/female/premium counts and revenue
12. **Manage Users** — Search users by name, make admin, grant premium, or delete users
13. **Approve Premium Requests** — Admin queue for approving biodata premium status requests
14. **Approve Contact Requests** — Admin queue to approve paid contact info requests
15. **Fully Responsive** — Mobile-first design with collapsible sidebar dashboard and drawer filters

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (no DaisyUI) |
| Routing | React Router DOM v7 |
| State / Data Fetching | TanStack Query v5 |
| Authentication | Firebase Auth (Email + Google OAuth) |
| HTTP Client | Axios (with JWT interceptor) |
| Payment | Stripe React + Stripe.js |
| Forms | React Hook Form |
| Notifications | SweetAlert2 |
| Charts | Recharts |
| Animations | Framer Motion |
| Image Hosting | ImgBB API |
| Icons | React Icons |
| Containerisation | Docker + Docker Compose |

---

## 📁 Project Structure

```
bandhanbd-client/
├── public/
├── src/
│   ├── main.jsx                          # App entry point
│   ├── index.css                         # Global styles
│   ├── firebase/
│   │   └── firebase.config.js            # Firebase initialization
│   ├── providers/
│   │   └── AuthProvider.jsx              # Auth context + JWT issuance
│   ├── hooks/
│   │   ├── useAuth.jsx                   # Access AuthContext
│   │   ├── useAdmin.jsx                  # Check admin role via TanStack Query
│   │   ├── useAxiosPublic.jsx            # Public Axios instance
│   │   ├── useAxiosSecure.jsx            # JWT-intercepted Axios instance
│   │   └── useFavorite.jsx               # Fetch user favourites
│   ├── Routes/
│   │   ├── Routes.jsx                    # Full router definition
│   │   ├── PrivateRoute.jsx              # Redirect guests to /login
│   │   └── AdminRoute.jsx                # Redirect non-admins to /
│   ├── Layout/
│   │   ├── Main.jsx                      # Public layout (Navbar + Footer)
│   │   └── Dashboard.jsx                 # Dashboard layout (sidebar + outlet)
│   ├── components/
│   │   ├── Banner.jsx
│   │   ├── Loading.jsx
│   │   ├── Premium.jsx
│   │   └── SocialLogin/SocialLogin.jsx
│   └── Pages/
│       ├── Shared/                       # Navbar, Footer
│       ├── Home/                         # Home, Works, SuccessCounter, SuccessStory
│       ├── BiodatasPage/
│       ├── BiodataDetails/
│       ├── Login/ & SignUp/
│       ├── About/ & Contact/ & ErrorPage/
│       └── Dashboard/
│           ├── User/                     # EditBiodata, ViewBiodata, Favourites, Checkout, etc.
│           └── Admin/                    # DashboardPage, ManageUsers, ApprovedPremium, etc.
├── Dockerfile                            # Production multi-stage build (Nginx)
├── Dockerfile.dev                        # Development server with hot reload
├── docker-compose.yml                    # Dev Compose configuration
├── .dockerignore
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20+** and npm *(for local dev)*
- **Docker** and **Docker Compose** *(for containerised run)*
- Firebase project
- Stripe account (test mode)
- ImgBB account

---

### Option A — Run Locally (Node.js)

```bash
# 1. Clone the repository
git clone https://github.com/sumu9897/bandhanbd-client.git
cd bandhanbd-client

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### Option B — Run with Docker (Development)

Hot-reload dev server inside a container using `Dockerfile.dev`.

```bash
# 1. Configure environment variables
cp .env.example .env

# 2. Build the dev image
docker build -f Dockerfile.dev -t bandhanbd-client-dev .

# 3. Run with volume mount for live reload
docker run -d \
  --name bandhanbd-client-dev \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e CHOKIDAR_USEPOLLING=true \
  bandhanbd-client-dev
```

The app will be available at `http://localhost:5173`.

---

### Option C — Run with Docker Compose *(recommended for development)*

```bash
# 1. Configure environment variables
cp .env.example .env

# 2. Build and start
docker compose up -d

# 3. View live logs
docker compose logs -f client

# 4. Stop and remove containers
docker compose down
```

The app will be available at `http://localhost:5173` with hot reload enabled.

---

### Option D — Production Build with Docker (Nginx)

The production `Dockerfile` uses a **multi-stage build** — Vite compiles the app, then `nginx:alpine` serves the static output. No Node.js in the final image.

```bash
# 1. Build the production image
#    Pass VITE_ vars at build time (Vite inlines them during compilation)
docker build \
  --build-arg VITE_API_BASE_URL=https://your-server.vercel.app \
  --build-arg VITE_STRIPE_PUBLIC_KEY=pk_test_xxx \
  --build-arg VITE_FIREBASE_API_KEY=your_key \
  -t bandhanbd-client .

# 2. Run the container
docker run -d \
  --name bandhanbd-client \
  -p 80:80 \
  bandhanbd-client
```

The app will be available at `http://localhost`.

> ⚠️ `VITE_*` variables are embedded at **build time**, not runtime. They must be passed as `--build-arg` flags, not via `--env-file`.

---

## 🐳 Docker Details

### Dockerfile — Production (Multi-Stage)

```dockerfile
# Stage 1: Build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

| Stage | Purpose |
|---|---|
| `builder` (node:20-alpine) | Installs dependencies and compiles the React/Vite app into `/app/dist` |
| `nginx:alpine` | Copies only the compiled static files — Node.js is discarded entirely |
| Final image size | ~25 MB vs ~400 MB if Node.js were included |

### Dockerfile.dev — Development

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

The `--host` flag tells Vite to bind to `0.0.0.0` so the dev server is reachable from the host machine on `localhost:5173`.

### docker-compose.yml

```yaml
services:
  client:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: bandhanbd-client
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    restart: unless-stopped
```

| Config | Purpose |
|---|---|
| `dockerfile: Dockerfile.dev` | Uses the dev image, not the production Nginx build |
| `.:/app` volume | Mounts source code into the container enabling live hot reload |
| `/app/node_modules` volume | Anonymous volume prevents the host's `node_modules` from overwriting the container's |
| `CHOKIDAR_USEPOLLING=true` | Required for file-watching on Windows, WSL2, and some macOS setups |
| `restart: unless-stopped` | Auto-restarts on crash; stops only on explicit `docker compose down` |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Server API
VITE_API_BASE_URL=https://your-server-domain.vercel.app

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Stripe (publishable key only — never the secret key)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx

# ImgBB image hosting
VITE_IMAGE_HOSTING_KEY=your_imgbb_key
```

> ⚠️ Never commit `.env` to version control. It is already listed in `.gitignore`.
>
> ℹ️ All variables must be prefixed with `VITE_` — Vite only exposes variables with this prefix to the browser bundle.

---

## 🔑 Authentication Flow

```
User signs in (Firebase)
       ↓
AuthProvider detects onAuthStateChanged
       ↓
POST /jwt { email } → Server issues 7-day JWT
       ↓
JWT stored in localStorage
       ↓
useAxiosSecure attaches JWT to every request header
       ↓
Server verifies JWT → grants/denies access
```

- Session persists across page refreshes via `onAuthStateChanged` re-issuing the JWT
- 401/403 responses automatically log the user out and redirect to `/login`

---

## 💳 Payment Flow

```
User clicks "Request Contact Info" on a biodata
       ↓
Redirected to /checkout/:biodataId (PrivateRoute)
       ↓
POST /payment/create-intent → Stripe PaymentIntent created ($5)
       ↓
User enters card details → stripe.confirmCardPayment()
       ↓
On success:
  1. POST /payments         → save payment record
  2. POST /contact-requests → create pending contact request
       ↓
Admin approves from dashboard
       ↓
User sees contact info in "My Contact Requests"
```

**Stripe Test Cards:**

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | ✅ Payment succeeds |
| `4000 0000 0000 9995` | ❌ Payment declined |
| `4000 0025 0000 3155` | 🔐 3D Secure required |

Use any future expiry date and any 3-digit CVV.

---

## 🧭 Route Map

| Path | Access | Component |
|---|---|---|
| `/` | Public | Home |
| `/biodatapage` | Public | BiodatasPage |
| `/biodata/:id` | Private | BiodataDetails |
| `/about` | Public | About |
| `/contact` | Public | ContactUs |
| `/login` | Public | Login |
| `/signup` | Public | SignUp |
| `/checkout/:biodataId` | Private | CheckOut |
| `/dashboard/edit-biodata` | Private | EditBiodata |
| `/dashboard/view-biodata` | Private | ViewBiodata |
| `/dashboard/contact-request` | Private | MyContactRequest |
| `/dashboard/my-favourites` | Private | FavouriteBiodata |
| `/dashboard/got-married` | Private | GotMarriedForm |
| `/dashboard/admin` | Admin | DashboardPage |
| `/dashboard/manage` | Admin | ManageUsers |
| `/dashboard/approvedPremium` | Admin | ApprovedPremium |
| `/dashboard/approvedContactRequest` | Admin | ApprovedContactReq |

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Ensure `firebase.json` is configured for SPA routing:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

## 🧪 Test Accounts

| Role | Email | Password |
|---|---|---|
| User | `user@bandhanbd.com` | `User@12345` |
| Premium User | `premium@bandhanbd.com` | `Premium@12345` |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🗂️ Git Commit Convention

```
feat: add biodata filter by division
fix: hide contact info for non-premium users
chore: update dependencies
refactor: extract useAxiosSecure hook
docker: add Dockerfile, Dockerfile.dev, and docker-compose
```

Maintain at least **12 meaningful commits** for client-side changes.

---

## 📄 License

This project is licensed under the MIT License.