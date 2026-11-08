/**
 * Admin Authentication Gatekeeper Middleware
 * Location: admin/middlewares/adminAuth.js
 * Strictly enforces access control for all /admin/* routes.
 */

/**
 * Ensures user is authenticated as an admin.
 * If not, redirects to the admin login page and preserves the intended destination.
 */
export const requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    return next();
  }

  // Preserve intended destination URL for post-login redirect (exclude POST/action endpoints)
  if (req.method === "GET") {
    req.session.returnTo = req.originalUrl;
  }

  return res.redirect("/admin/login");
};

/**
 * If the admin is already logged in, bypass the login screen and go to the dashboard.
 */
export const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    return res.redirect("/admin/dashboard");
  }
  next();
};

