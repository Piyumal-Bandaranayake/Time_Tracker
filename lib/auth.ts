import jwt from "jsonwebtoken";


export function getTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}


export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email?: string;
    };

    return decoded;
  } catch (error) {
    return null;
  }
}


export function getUserIdFromToken(req: Request): string | null {
  const token = getTokenFromHeader(req);

  if (!token) return null;

  const decoded = verifyToken(token);

  if (!decoded) return null;

  return decoded.userId;
}

export function requireAuth(req: Request) {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
