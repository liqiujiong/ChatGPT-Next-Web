import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }
  // console.log(`[Proxy] ${baseUrl}/${openaiPath}`)
  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}


// const API_BASE_URL = process.env.BASE_URL ?? "https://aitop.lqjhome.cn/api";

// export async function requestProxy(req: NextRequest) {
//   const auth = req.headers.get("Authorization") || '';
//   const openaiPath = req.headers.get("path");

//   console.log("[Proxy] ", openaiPath);

//   return fetch(`${API_BASE_URL}/${openaiPath}`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: auth,
//     },
//     method: req.method,
//     body: req.body,
//   });
// }
