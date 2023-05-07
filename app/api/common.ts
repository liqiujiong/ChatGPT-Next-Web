import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const authValue = req.headers.get("Authorization") ?? "";
  const openaiPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
    "/api/openai/",
    "",
  );

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  // console.log("[Proxy] ", openaiPath);
  // console.log("[Base Url]", baseUrl);

  if (process.env.OPENAI_ORG_ID) {
    console.log("[Org ID]", process.env.OPENAI_ORG_ID);
  }

  if (!authValue || !authValue.startsWith("Bearer sk-")) {
    console.error("[OpenAI Request] invlid api key provided", authValue);
  }

  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authValue,
      ...(process.env.OPENAI_ORG_ID && {
        "OpenAI-Organization": process.env.OPENAI_ORG_ID,
      }),
    },
    cache: "no-store",
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
