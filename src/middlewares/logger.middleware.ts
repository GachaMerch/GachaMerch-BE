// Module
import { Request, Response, NextFunction } from "express";

const SENSITIVE_KEYS = ["password", "token", "deviceToken", "authorization"];

function maskSensitive(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      SENSITIVE_KEYS.some((sensitiveKey) =>
        key.toLowerCase().includes(sensitiveKey)
      )
        ? [key, "***"]
        : [key, value]
    )
  );
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const { method, originalUrl } = req;
  console.log(
    `--> ${method.padEnd(6)} ${originalUrl} [${new Date().toISOString()}]`
  );

  let responseBody: any;
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const statusColor =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
          ? "\x1b[33m"
          : status >= 300
            ? "\x1b[36m"
            : "\x1b[32m";

    const reset = "\x1b[0m";
    const gray = "\x1b[90m";
    const cyan = "\x1b[36m";
    const bold = "\x1b[1m";
    const separator = `${gray}${"-".repeat(60)}${reset}`;

    console.log(separator);
    console.log(
      `${bold}${method.padEnd(6)}${reset} ` +
        `${statusColor}${status}${reset} ` +
        `${originalUrl} ` +
        `${gray}${duration}ms${reset}  ` +
        `${gray}[${new Date().toISOString()}]${reset}`
    );

    const hasParams = req.params && Object.keys(req.params).length > 0;
    const hasQuery = req.query && Object.keys(req.query).length > 0;
    const hasBody = req.body && Object.keys(req.body).length > 0;

    if (hasParams) {
      console.log(
        `${cyan}  request.params${reset}  `,
        JSON.stringify(maskSensitive(req.params))
      );
    }

    if (hasQuery) {
      console.log(
        `${cyan}  request.query${reset}   `,
        JSON.stringify(maskSensitive(req.query))
      );
    }

    if (hasBody) {
      console.log(
        `${cyan}  request.body${reset}    `,
        JSON.stringify(maskSensitive(req.body))
      );
    }

    if (responseBody !== undefined) {
      const preview = JSON.stringify(responseBody);
      const trimmed =
        preview.length > 300 ? `${preview.slice(0, 300)}...` : preview;

      console.log(`${statusColor}  response.body${reset}`, trimmed);
    }
  });

  next();
}
