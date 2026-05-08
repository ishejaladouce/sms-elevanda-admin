// OpenAPI 3 specification for the SMS Elevanda Admin API.
// Hand-written so it stays simple to read and update.

const okResponse = (label) => ({
  description: label,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/SuccessResponse" },
    },
  },
});

const errorResponse = (status, label) => ({
  description: label,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
});

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "SMS Elevanda - Admin API",
    version: "1.0.0",
    description:
      "REST API for the staff portal. Admins can verify devices, manage classes, and review every record across the school. Authentication uses an httpOnly JWT cookie.",
    contact: { name: "Elevanda Ventures", email: "careers@elevandaventures.com" },
  },
  servers: [
    { url: "http://localhost:5001", description: "Local development" },
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Auth", description: "Staff registration, login and logout" },
    { name: "Users", description: "User accounts and device verification" },
    { name: "Dashboard", description: "Aggregate statistics for admins" },
    { name: "Classes", description: "Create classes and assign teachers" },
    { name: "Teachers", description: "Teacher directory" },
    { name: "Students", description: "Student directory" },
    { name: "Fees", description: "All fee transactions across the school" },
    { name: "Grades", description: "All grades across the school" },
    { name: "Attendance", description: "All attendance records across the school" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "sms_token",
        description: "JWT issued on login, stored in an httpOnly cookie.",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "OK" },
          data: { type: "object", nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Something went wrong" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password", "role", "deviceId"],
        properties: {
          name: { type: "string", minLength: 2, example: "Eric K." },
          email: { type: "string", format: "email", example: "eric@school.rw" },
          password: { type: "string", minLength: 6, example: "secret123" },
          role: { type: "string", enum: ["ADMIN", "TEACHER"], example: "TEACHER" },
          deviceId: { type: "string", minLength: 3, example: "device-xyz-456" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password", "deviceId"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
          deviceId: { type: "string" },
        },
      },
      ClassCreateRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 2, example: "Senior 3 - Sciences" },
          teacherId: { type: "string", nullable: true, example: "clx123abc" },
        },
      },
      ClassUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2 },
          teacherId: { type: "string", nullable: true },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: { 200: okResponse("Server is up") },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a staff account (admin or teacher)",
        description:
          "Creates an account in pending state. An admin must verify the device before login is allowed.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } },
          },
        },
        responses: {
          201: okResponse("Account created"),
          400: errorResponse(400, "Validation failed"),
          409: errorResponse(409, "Email already in use"),
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        description:
          "Validates email, password and device. On success an httpOnly JWT cookie is set.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
          },
        },
        responses: {
          200: okResponse("Logged in"),
          401: errorResponse(401, "Invalid email or password"),
          403: errorResponse(403, "Device not verified or device mismatch"),
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out",
        responses: { 200: okResponse("Logged out") },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Users"],
        summary: "List every user in the system",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Users") },
      },
    },
    "/api/admin/users/{id}/verify-device": {
      patch: {
        tags: ["Users"],
        summary: "Mark a user's current device as verified",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        responses: {
          200: okResponse("Device verified"),
          404: errorResponse(404, "User not found"),
        },
      },
    },
    "/api/admin/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Aggregate stats: students, teachers, fees collected, attendance rate",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Stats") },
      },
    },
    "/api/admin/classes": {
      get: {
        tags: ["Classes"],
        summary: "List all classes",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Classes") },
      },
      post: {
        tags: ["Classes"],
        summary: "Create a class",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ClassCreateRequest" } },
          },
        },
        responses: {
          201: okResponse("Class created"),
          400: errorResponse(400, "Validation failed"),
        },
      },
    },
    "/api/admin/classes/{id}": {
      patch: {
        tags: ["Classes"],
        summary: "Update a class",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ClassUpdateRequest" } },
          },
        },
        responses: { 200: okResponse("Class updated") },
      },
      delete: {
        tags: ["Classes"],
        summary: "Delete a class",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: okResponse("Class deleted") },
      },
    },
    "/api/admin/teachers": {
      get: {
        tags: ["Teachers"],
        summary: "List teachers and their assigned classes",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Teachers") },
      },
    },
    "/api/admin/students": {
      get: {
        tags: ["Students"],
        summary: "List students with class and parent details",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Students") },
      },
    },
    "/api/admin/fees": {
      get: {
        tags: ["Fees"],
        summary: "List every fee transaction across the school",
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse("Fee transactions") },
      },
    },
    "/api/admin/grades": {
      get: {
        tags: ["Grades"],
        summary: "List grades, filterable by term, subject and class",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "term", in: "query", required: false, schema: { type: "string" } },
          { name: "subject", in: "query", required: false, schema: { type: "string" } },
          { name: "classId", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: { 200: okResponse("Grades") },
      },
    },
    "/api/admin/attendance": {
      get: {
        tags: ["Attendance"],
        summary: "List attendance, filterable by status, class and date range",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "status", in: "query", required: false, schema: { type: "string", enum: ["PRESENT", "LATE", "ABSENT"] } },
          { name: "classId", in: "query", required: false, schema: { type: "string" } },
          { name: "dateFrom", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "dateTo", in: "query", required: false, schema: { type: "string", format: "date" } },
        ],
        responses: { 200: okResponse("Attendance") },
      },
    },
  },
};
