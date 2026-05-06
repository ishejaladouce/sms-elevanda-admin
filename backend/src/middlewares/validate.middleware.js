import { ZodError } from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          data: { issues: err.issues },
        });
      }
      next(err);
    }
  };
}

