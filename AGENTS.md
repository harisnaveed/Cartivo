# 🤖 AGENTS.md — Mandatory AI Agent Operating Guidelines

> [!IMPORTANT]
> ## 🚨 0. MANDATORY FIRST STEP: ALWAYS READ THIS AGENTS.MD BEFORE DOING ANYTHING
> **BEFORE performing ANY task, running ANY command, writing ANY code, creating ANY file, or making ANY modification in this codebase, EVERY AI AGENT AND ASSISTANT MUST FIRST READ AND REVIEW THIS `AGENTS.md` FILE IN FULL.**
> - Never skip this step.
> - Always treat the rules in this file as binding, non-negotiable instructions.
> - Every action taken must strictly comply with the protocols set forth below.

---

## ⛔ 1. STRICT GIT & GITHUB POLICY (CRITICAL)

> [!CAUTION]
> ### ABSOLUTELY NO REMOTE GIT OPERATIONS
> - **NEVER** run `git push` under any circumstances.
> - **NEVER** run `git pull` under any circumstances.
> - **NEVER** run `git fetch`, `git remote update`, or interact with any remote Git/GitHub repository.
> - **ALL remote GitHub pushes and pulls are handled MANUALLY by the repository owner alone.**
> - Agents may only inspect local Git status (`git status`, `git diff`, `git log`) if needed for situational awareness, but must **NEVER** trigger any remote synchronization.

---

## 🧭 2. HIERARCHY & FILE STRUCTURE FIRST (MANDATORY PRE-CHECK)

Before executing any edits, creating files, or restructuring code, the agent **MUST ALWAYS**:

1. **Inspect Existing Project Hierarchy**:
   - Explore and understand the directory tree and file locations before writing any code.
   - Understand the dual-layer architecture:
     - **Storefront Layer (Public)**: Root-level controllers (`controllers/`), routes (`routes/pageRoutes.js`), views (`views/*.ejs`).
     - **Back-Office Layer (Admin)**: Isolated admin subsystem (`admin/controllers/`, `admin/models/`, `admin/routes/`, `views/admin/`).
2. **Follow Strict Placement Rules**:
   - **Models**: Place root schemas in `models/`. Admin re-exports/wrappers belong in `admin/models/`.
   - **Controllers**: Public controllers go in `controllers/`; admin CRUD controllers go in `admin/controllers/`.
   - **Routes**: Public web routes go in `routes/pageRoutes.js`; admin routers go in `admin/routes/` and are mounted in `app.js` under `/admin/...`.
   - **Views**:
     - Public templates live in `views/` (e.g., `home.ejs`, `shop.ejs`, `product-details.ejs`).
     - Admin templates live in `views/admin/<resource>/` (e.g., `views/admin/products/`, `views/admin/categories/`).
     - Reusable partials live in `views/partials/` (`header.ejs`, `footer.ejs`, `headcdns.ejs`, etc.).
   - **Static Assets**:
     - Custom CSS & Clay animations in `public/css/`.
     - Client JavaScript in `public/js/`.
     - User uploads stored exclusively in `public/uploads/`.
     - **Admin Assets**: Dedicated admin CSS in `public/css/admin/` and admin JS in `public/js/admin/`. Never mix admin assets with storefront assets.
   - **Data Stores**: Non-MongoDB persistent files (e.g., leads) belong in `data/`.
3. **Admin Folder Isolation Rule (Mandatory)**:
   - All files related to the admin portal MUST always live inside their respective `admin` directories:
     - Admin Views & Dashboards: `views/admin/`
     - Admin Global Partials: `views/admin/partials/` (`header.ejs`, `sidebar.ejs`, `footer.ejs`, `headcdns.ejs`, `footercdns.ejs`)
     - Admin Styling: `public/css/admin/style.css`
     - Admin Client JavaScript: `public/js/admin/admin.js`
     - Admin Backend: `admin/controllers/`, `admin/models/`, `admin/routes/`
   - Storefront pages and storefront assets must remain completely separate from the admin portal.

---

## 📐 3. CODE PATTERN & STYLE CONSISTENCY

All new or modified code must seamlessly match the established patterns and conventions in the codebase:

### A. JavaScript & Module Standard
- **Native ES Modules (ESM)**: The project uses `"type": "module"`. Always use `import` and `export`. **Never use `require()` or `module.exports`**.
- **Explicit File Extensions**: Always provide explicit `.js` extensions for relative file imports:
  ```javascript
  // ✅ Correct
  import Product from "../models/Product.js";
  import connectDB from "../config/db.js";

  // ❌ Incorrect
  const Product = require("../models/Product");
  import Product from "../models/Product";
  ```

### B. Controller Conventions
- Export individual async arrow functions:
  ```javascript
  export const getItems = async (req, res) => {
    try {
      // Logic
      res.render("view-name", { ... });
    } catch (error) {
      console.error("Context Error:", error.message);
      res.status(500).send("User-friendly message");
    }
  };
  ```
- **MongoDB ID Validation**: Always validate MongoDB ObjectIds using `mongoose.Types.ObjectId.isValid(id)` before querying by ID.
- **Referential Integrity**: Before deleting a parent entity (e.g., Category), verify dependent children (e.g., Products) do not exist to avoid orphaned records.
- **Filesystem Cleanup**: When updating or deleting entities that hold file uploads, unlink old files from `public/uploads/` using `fs.unlink()` with `ENOENT` error tolerance.

### C. Mongoose Models
- Use `timestamps: true` on all schemas.
- Use `pre("validate")` lifecycle hooks with `slugify` to generate clean, lowercase, URL-friendly slugs from entity names automatically:
  ```javascript
  schema.pre("validate", function () {
    if (this.isModified("name") && this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
    }
  });
  ```

### D. Views & Frontend Aesthetic
- Use standard EJS extension: `.ejs` (never `.js` for view templates).
- Follow the established design system:
  - Tailwind CSS utility classes.
  - Scandinavian minimalist palette (`slate-900`, `amber-500`, `emerald-500`, soft white cards with backdrop blur).
  - Ambient 3D floating clay elements (`clay-torus`, `clay-sphere-blue`, `clay-pill-amber`).
  - Standard partial inclusion: `<%- include('partials/header') %>` or relative path `<%- include('../../partials/header') %>` depending on template depth.
  - Active navigation pill highlighting driven by `res.locals.currentPath`.

---

## 🔍 4. POST-ACTION VERIFICATION PROTOCOL (ZERO-ERROR GUARANTEE)

At the completion of any task, the agent **MUST** perform verification to guarantee zero regressions:

1. **Route & Template Integrity**:
   - Check all route paths have proper leading slashes (e.g., `router.get("/create", ...)` not `router.get("create", ...)`).
   - Ensure every `res.render("path/to/view")` maps to an actual existing `.ejs` file on disk.
   - Verify view extensions are `.ejs` and not `.js` or `.html`.
2. **Directory & Upload Path Validation**:
   - Ensure target directories (such as `public/uploads/`) exist before file operations attempt to read or write to them.
3. **Dead Link Prevention**:
   - Confirm all frontend buttons, action anchors, and form targets point to existing, active routes.
4. **Console & Runtime Diagnostics**:
   - Ensure no unhandled promise rejections, syntax errors, or circular dependency loops are introduced.

---

## 🧹 5. CODE INTEGRITY & LINT CHECK AT THE END

Before completing any task:
1. **Syntax Check**:
   - Run a Node.js syntax verification on all JavaScript files created or edited:
     ```powershell
     node -c <filePath>
     ```
   - Ensure zero syntax errors, missing braces, unclosed quotes, or invalid imports.
2. **Code Cleanliness**:
   - Remove leftover temporary debugging code, orphan test scripts, or unused duplicate functions.
   - Ensure proper indentation, clean formatting, and consistent comments.
   - Preserve existing documentation, comments, and project conventions.

---

## 📋 6. IMPLEMENTATION & SOLUTION PLANS MUST BE DELIVERED IN ARTIFACTS ONLY

> [!IMPORTANT]
> ### MANDATORY ARTIFACT DELIVERY FOR PLANS
> - **Whenever proposing an implementation plan, architectural design, or solution strategy, the agent MUST ALWAYS deliver it as a structured markdown Artifact (`.md` in the artifact directory).**
> - **NEVER dump lengthy implementation or solution plans directly into the chat window.**
> - Keep the chat response concise, pointing the user directly to the artifact and highlighting only high-level decisions or questions that need the user's approval.
> - Do not begin executing multi-step or impactful changes until the user has reviewed and approved the plan presented in the artifact.

---

> **Summary for AI Agents**: **Read AGENTS.md first** → Deliver plans in Artifacts (never in chat) → Inspect hierarchy & structure → Match existing code patterns → Never push/pull remote Git → Verify all views, routes, and paths → Syntax check / lint all modified files at the end.
