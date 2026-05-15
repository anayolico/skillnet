# SkillNet Backend API Documentation

The SkillNet backend is a Node.js Express application utilizing Prisma as the ORM to interact with a Neon PostgreSQL database. All secure endpoints require a Bearer token issued by Supabase Auth.

## Base URL
\`\`\`text
http://localhost:3001
\`\`\`

## Authentication Middleware
Endpoints protected by the \`requireAuth\` middleware expect an \`Authorization\` header containing a valid Supabase JWT.
\`\`\`text
Authorization: Bearer <Supabase_Access_Token>
\`\`\`

---

## Health & Diagnostics

### Liveness Probe
- **Method:** \`GET\`
- **Path:** \`/health\`
- **Description:** Returns a 200 OK status if the Express app is running.
- **Response:**
  \`\`\`json
  { "status": "ok", "timestamp": "...", "uptime": 123 }
  \`\`\`

### Readiness Probe
- **Method:** \`GET\`
- **Path:** \`/ready\`
- **Description:** Returns a 200 OK status if the database connection is verified.
- **Response:**
  \`\`\`json
  { "ready": true, "database": "connected", "timestamp": "..." }
  \`\`\`

---

## User & Authentication

### Sync Supabase User
- **Method:** \`POST\`
- **Path:** \`/api/auth/sync\`
- **Description:** Syncs the current Supabase session identity to the Prisma \`User\` table.
- **Body:** \`{ metadata: { full_name?: string, avatar_url?: string } }\`
- **Response:** \`{ success: true, user: UserObject }\`

### Verify Onboarding Status
- **Method:** \`GET\`
- **Path:** \`/api/auth/verify\`
- **Description:** Checks if the authenticated user has completed full onboarding.
- **Auth:** Required
- **Response:** \`{ success: true, userId: string, isOnboarded: boolean }\`

### Current User Profile
- **Method:** \`GET\`
- **Path:** \`/api/me\`
- **Description:** Returns the current authenticated user joined with their full \`Profile\`.
- **Auth:** Required
- **Response:** \`{ success: true, user: User & { profile: Profile } }\`

### Submit Onboarding
- **Method:** \`POST\`
- **Path:** \`/api/onboarding\`
- **Description:** Creates or updates a user's \`Profile\` (headline, bio, skills, preferences).
- **Auth:** Required
- **Body:**
  \`\`\`json
  {
    "firstName": "John",
    "lastName": "Doe",
    "headline": "Senior Dev",
    "bio": "I write code...",
    "skillsOffered": ["React", "Node"],
    "skillsSought": ["Marketing", "Sales"],
    "experienceLevel": "Senior",
    "availability": "Medium",
    "timezone": "America/New_York"
  }
  \`\`\`
- **Response:** \`{ success: true }\`

---

## Marketplace & Discovery

### Fetch Discovery Partners
- **Method:** \`GET\`
- **Path:** \`/api/marketplace/partners\`
- **Description:** Fetches paginated profiles for the Discovery Hub. Excludes the current caller.
- **Auth:** Required
- **Query Params:**
  - \`page\` (default 1)
  - \`limit\` (default 12)
  - \`search\` (filters across headline, skills given, skills sought)
  - \`category\` (filters by skills given)
- **Response:**
  \`\`\`json
  {
    "success": true,
    "data": [ ProfileObject, ... ],
    "total": 54,
    "page": 1,
    "pages": 5
  }
  \`\`\`

### Fetch Live Marketplace Stats
- **Method:** \`GET\`
- **Path:** \`/api/marketplace/stats\`
- **Description:** Calculates and returns the live swap performance statistics.
- **Auth:** Required
- **Response:**
  \`\`\`json
  {
    "success": true,
    "stats": {
      "completedSwaps": 105,
      "activeSwaps": 32,
      "uniqueSkillDomains": 54,
      "successRate": 0.98
    }
  }
  \`\`\`

---

## Marketplace Listings

### Get Active Listings
- **Method:** \`GET\`
- **Path:** \`/api/marketplace/listings\`
- **Description:** Retrieves all globally active listings, joining with the owner's minimal user data.
- **Auth:** Required

### Create a Listing
- **Method:** \`POST\`
- **Path:** \`/api/marketplace/listings\`
- **Description:** Posts a new skill offer to the marketplace.
- **Auth:** Required
- **Body:**
  \`\`\`json
  {
    "title": "React Architecture Session",
    "description": "Will review your codebase...",
    "category": "React",
    "sessionFormat": "Live Video Call",
    "timeValue": "1 Hour Session",
    "skillsOffered": ["React"],
    "skillsSought": ["Figma", "Design"]
  }
  \`\`\`

### Retrieve / Update / Deactivate Listing
- **Method:** \`GET | PUT | DELETE\`
- **Path:** \`/api/marketplace/listings/:id\`
- **Description:** Retrieve a single listing by ID, update its details, or soft-deactivate it respectively. Note that \`PUT\` and \`DELETE\` assert caller ownership over the listing.
- **Auth:** Required

---

## Swap Requests

### Initiate a Swap Request
- **Method:** \`POST\`
- **Path:** \`/api/marketplace/swap-requests\`
- **Description:** Propose an experiential swap to a listing's owner.
- **Auth:** Required
- **Body:**
  \`\`\`json
  {
    "listingId": "listing_id_string",
    "message": "Hi, I can offer Figma expertise if you teach me React!"
  }
  \`\`\`

### Fetch Assigned Swap Requests
- **Method:** \`GET\`
- **Path:** \`/api/marketplace/swap-requests\`
- **Description:** Returns arrays of both \`sent\` and \`received\` requests tied to the current caller.
- **Auth:** Required
- **Response:** \`{ success: true, sent: [], received: [] }\`

### Accept or Decline Request
- **Method:** \`PUT\`
- **Path:** \`/api/marketplace/swap-requests/:id\`
- **Description:** Update the status of a pending swap request. Accepting will automatically generate an active \`Swap\` agreement entity between both participants.
- **Auth:** Required
- **Body:**
  \`\`\`json
  {
    "status": "accepted" // or "declined"
  }
  \`\`\`
