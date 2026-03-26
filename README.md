# Men Amman - من عمان

**Your Digital Street Bazaar in Amman**

A full-stack mobile marketplace connecting local independent sellers with buyers in Amman, Jordan. Built with React Native (Expo), Node.js, Express, and MongoDB.

---

## 🔗 Demo Link (Expo Go)

> **Scan with Expo Go** → `exp.host/@YOUR_EXPO_USERNAME/men-amman`

To generate your shareable demo link:

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to Expo
eas login

# 3. Configure the project (one-time)
eas init

# 4. Publish an update (shareable Expo Go link)
cd frontend
npx expo publish
```

Your link will be: `https://expo.dev/@YOUR_USERNAME/men-amman`

---

## 🚀 Deploy to Production

### Step 1 — Deploy Backend to Render (free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your repo — Render auto-detects `render.yaml`
4. Set these environment variables in the Render dashboard:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → any random secret string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` → from [cloudinary.com](https://cloudinary.com) (free)
   - `CLIENT_URL` → `*` (or your Expo app URL)
5. Deploy — your API will be live at `https://men-amman-api.onrender.com`

### Step 2 — Update Frontend API URL

In [frontend/app.json](frontend/app.json), update `extra.apiUrl`:

```json
"extra": {
  "apiUrl": "https://YOUR-APP-NAME.onrender.com/api"
}
```

### Step 3 — Seed the Database

```bash
cd backend
MONGODB_URI=your_atlas_uri node utils/seed.js
```

### Step 4 — Publish Frontend

```bash
cd frontend
npx expo publish
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Seed Sample Data

```bash
cd backend
node utils/seed.js
```

Test accounts after seeding:
| Role | Email | Password |
|------|-------|----------|
| Seller | lina@test.com | password123 |
| Seller | omar@test.com | password123 |
| Seller | sara@test.com | password123 |
| Buyer | ahmad@test.com | password123 |
| Buyer | nour@test.com | password123 |

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

Then scan the QR code with Expo Go (mobile) or press `w` for web.

**Important:** Update `API_URL` in `frontend/src/api/index.js` to match your backend:
- Android emulator: `http://10.0.2.2:5000/api`
- iOS simulator: `http://localhost:5000/api`
- Physical device: `http://YOUR_IP:5000/api`

---

## Project Structure

```
men-amman/
├── backend/
│   ├── server.js              # Express + Socket.IO entry
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Image upload config
│   ├── middleware/
│   │   ├── auth.js            # JWT auth + role guard
│   │   └── upload.js          # File upload middleware
│   ├── models/
│   │   ├── User.js            # Buyer/Seller accounts
│   │   ├── Shop.js            # Storefronts
│   │   ├── Product.js         # Listings
│   │   ├── Conversation.js    # Chat threads
│   │   ├── Message.js         # Chat messages
│   │   ├── Drop.js            # New drops / announcements
│   │   ├── Story.js           # 24hr stories
│   │   └── Rating.js          # Reviews
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   └── utils/
│       └── seed.js            # Sample data seeder
├── frontend/
│   ├── App.js                 # Entry point
│   └── src/
│       ├── api/index.js       # API client + all endpoints
│       ├── context/AuthContext.js
│       ├── theme/index.js     # Design system
│       ├── navigation/index.js
│       ├── components/
│       │   ├── common/        # Buttons, inputs, search, tags
│       │   └── cards/         # Product, shop, story, drop cards
│       └── screens/
│           ├── auth/          # Welcome, Login, Register
│           ├── home/          # Main feed
│           ├── product/       # Product detail
│           ├── shop/          # Shop profile, create, add product
│           ├── search/        # Search + filters
│           ├── messages/      # Conversations, chat
│           └── profile/       # User profile + settings
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Shops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shops` | List shops (filter: category, neighborhood, search) |
| POST | `/api/shops` | Create shop (auth) |
| GET | `/api/shops/:id` | Get shop + products |
| PUT | `/api/shops/:id` | Update shop (owner) |
| GET | `/api/shops/my/shop` | Get my shop (auth) |
| POST | `/api/shops/:id/follow` | Toggle follow (auth) |
| GET | `/api/shops/featured` | Featured shops |
| GET | `/api/shops/new` | New shops |
| GET | `/api/shops/nearby` | Nearby shops (lng, lat) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (filter: category, vibeTag, price, neighborhood, search) |
| POST | `/api/products` | Create product (seller) |
| GET | `/api/products/:id` | Get product detail |
| PUT | `/api/products/:id` | Update product (owner) |
| DELETE | `/api/products/:id` | Delete product (owner) |
| POST | `/api/products/:id/like` | Toggle like/save (auth) |
| GET | `/api/products/trending` | Trending products |
| GET | `/api/products/feed` | Product feed |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/conversation` | Create/get conversation |
| GET | `/api/messages/conversations` | List conversations |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/:conversationId` | Get messages |
| PUT | `/api/messages/offer/:conversationId` | Respond to offer |

### Drops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drops` | List active drops |
| POST | `/api/drops` | Create drop (seller) |
| GET | `/api/drops/shop/:shopId` | Shop's drops |
| DELETE | `/api/drops/:id` | Delete drop (owner) |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get active stories (grouped by shop) |
| POST | `/api/stories` | Create story (seller) |
| POST | `/api/stories/:id/view` | Mark story viewed |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings` | Rate shop or product |
| GET | `/api/ratings/shop/:shopId` | Shop ratings |
| GET | `/api/ratings/product/:productId` | Product ratings |

---

## Features by Phase

### Phase 1 - Core MVP
- [x] Auth (buyer + seller roles)
- [x] Create/manage shops
- [x] Add/edit/delete products
- [x] Product feed with categories
- [x] Shop profiles
- [x] Search (products + shops)
- [x] In-app messaging
- [x] Amman street-vibe UI

### Phase 2 - Discovery & Engagement
- [x] Price/location/vibe filters
- [x] Like/save system
- [x] Follow shops
- [x] Categories
- [x] Trending & new sections

### Phase 3 - Local Experience
- [x] Neighborhood tagging (15 Amman areas)
- [x] Near Me feature
- [x] Location-based shop discovery

### Phase 4 - Social & Culture
- [x] Drops system (new drops, limited items)
- [x] Custom orders
- [x] "Make an Offer" negotiation
- [x] Cultural tags (Made in Amman, Support Local, etc.)
- [x] Stories feature

### Phase 5 - Polish & Advanced
- [x] Seller verification badge system
- [x] Instagram link integration
- [x] WhatsApp redirect
- [x] Rating system
- [x] Real-time messaging (Socket.IO)

---

## Design System

**Colors:** Terracotta, Dusty Orange, Sand, Olive Green, Navy, Gold
**Style:** Warm, artistic, handmade feel — inspired by Amman souqs and street culture
**UX:** Friendly, local, human — not corporate

---

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/men-amman
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name     # optional
CLOUDINARY_API_KEY=your_api_key           # optional
CLOUDINARY_API_SECRET=your_api_secret     # optional
CLIENT_URL=http://localhost:19006
```

---

Built with love, from Amman.
