import portfolio from "./portfolio.html?raw";

export function GET() {
  return new Response(portfolio, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
