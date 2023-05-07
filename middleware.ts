import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "./app/config/server";
import md5 from "spark-md5";

export const config = {
  matcher: ["/api/openai/v1/chat/completions"],
};

// const serverConfig = getServerSideConfig();

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

async function getContentPayload(req: NextRequest) {
  return await req.json()
}

async function getContent(payload: { messages: any[] }) {
  let result = ''
  try {
    const messages = payload.messages || []
    if (messages.length === 0) {
      return ''
    }
    let totalLength = 0
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      totalLength += message.content.length
    }
    const lastMessage = messages[messages.length - 1]
    result = totalLength + ':' + lastMessage['content']
  } catch (e) {
    console.error('Error:', e)
    return ''
  }
  return result
}

async function printLog(req: NextRequest, payload: any) {
  console.log(`[${new Date().toLocaleString()}-${getIP(req)}]len:${await getContent(payload)}`)
}

export async function middleware(req: NextRequest) {
  // const accessCode = req.headers.get("access-code");
  // const token = req.headers.get("token");
  // const hashedCode = md5.hash(accessCode ?? "").trim();

  // if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       needAccessCode: true,
  //       msg: "Please go settings page and fill your access code.",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  // // inject api key
  // if (!token) {
  //   const apiKey = serverConfig.apiKey;
  //   if (apiKey) {
  //     // console.log("[Auth] set system token");
  //     req.headers.set("token", apiKey);
  //   } else {
  //     return NextResponse.json(
  //       {
  //         error: true,
  //         msg: "Empty Api Key",
  //       },
  //       {
  //         status: 401,
  //       },
  //     );
  //   }
  // } else {
  //   console.log("[Auth] set user token");
  // }

  const payload = await getContentPayload(req)

  printLog(req, payload)
  const messages = payload.messages || []
  const lastMessage = payload.messages[messages.length - 1]
  // console.log('lastMessage :>> ', lastMessage);
  // if (lastMessage.content === 'test') {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       needAccessCode: true,
  //       msg: "Please go settings page and fill your access code.",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
