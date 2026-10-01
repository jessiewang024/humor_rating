import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 白名单：不登录也能访问的路径。其余全部需要登录。
// /auth 必须在这里，否则 OAuth 回调会被拦截，登录永远无法完成。
const PUBLIC_ROUTES = ["/login", "/auth"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
            );
          },
        },
      }
  );

  // 用 getUser() 而不是 getSession()：getUser 会向 Supabase 验证 token，不能伪造
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route));

  // 未登录 + 非公开页面 → 去登录页
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 已登录还访问登录页 → 直接回首页
  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};