import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  console.log("getting user");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.auth.getSession();

  // if user is signed in and the current path is / redirect the user to /account
  // if (user) {
  //         return NextResponse.redirect(new URL('/', req.url))
  //       }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
  // await supabase.auth.getSession();
}

export const config = {
  matcher: ["/", "/account"],
};
