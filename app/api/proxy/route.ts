import { NextRequest } from "next/server";

const BASE_API_URL = "aitop.lqjhome.cn/api";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_API_URL = process.env.BASE_URL ?? BASE_API_URL;

export async function requestAPIProxy(req: NextRequest) {
  const path = req.headers.get("path");
  const url = `${PROTOCOL}://${BASE_URL}/${path}`;
  console.log("[Proxy] ", path,url);
  return fetch(url, {
    headers: req.headers,
    method: req.method,
    body: req.body,
  });
}

export async function POST(req: NextRequest) {
  return requestAPIProxy(req);
}

export async function GET(req: NextRequest) {
  return requestAPIProxy(req);
}
