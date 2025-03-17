import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    if (req.url.includes("/api")) {
      return NextResponse.json(
        { message: "Authentication failed!" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  try {
    const response = await fetch("http://localhost:3000/api/auth/jwtAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.log(err);
    if (req.url.includes("/api")) {
      return NextResponse.json(
        { message: "Authentication failed!" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/main/:path*", "/admin/:path*"], 
};
