export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "SMS Elevanda Admin API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:5001" }],
  paths: {
    "/api/health": { get: { summary: "Health check", responses: { 200: { description: "OK" } } } },
    "/api/auth/register": { post: { summary: "Register staff (admin/teacher) with deviceId", responses: { 201: { description: "Created" } } } },
    "/api/auth/login": { post: { summary: "Login (device must be verified)", responses: { 200: { description: "OK" }, 403: { description: "Device not verified" } } } },
    "/api/auth/logout": { post: { summary: "Logout (clears cookie)", responses: { 200: { description: "OK" } } } },
    "/api/admin/users": { get: { summary: "List all users (admin only)", responses: { 200: { description: "OK" } } } },
    "/api/admin/users/{id}/verify-device": { patch: { summary: "Verify user device (admin only)", responses: { 200: { description: "OK" } } } },
    "/api/admin/dashboard/stats": { get: { summary: "Admin dashboard stats", responses: { 200: { description: "OK" } } } },
    "/api/admin/teachers": { get: { summary: "List teachers (admin only)", responses: { 200: { description: "OK" } } } },
    "/api/admin/classes": {
      get: { summary: "List classes (admin only)", responses: { 200: { description: "OK" } } },
      post: { summary: "Create class (admin only)", responses: { 201: { description: "Created" } } }
    },
    "/api/admin/classes/{id}": {
      patch: { summary: "Update class (admin only)", responses: { 200: { description: "OK" } } },
      delete: { summary: "Delete class (admin only)", responses: { 200: { description: "OK" } } }
    }
  },
};

