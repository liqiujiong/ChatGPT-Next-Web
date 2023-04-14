import { NextRequest, NextResponse } from "next/server";
import { ACCESS_CODES } from "./app/api/access";
import md5 from "spark-md5";

export const config = {
  matcher: ["/api/openai", "/api/chat-stream"],
};

export async function middleware(req: NextRequest) {
  const accessCode = req.headers.get("access-code");
  const token = req.headers.get("token");
  const hashedCode = md5.hash(accessCode ?? "").trim();

  // console.log("[Auth] allowed hashed codes: ", [...ACCESS_CODES]);
  // console.log("[Auth] got access code:", accessCode);
  // console.log("[Auth] hashed access code:", hashedCode);

  if (ACCESS_CODES.size > 0 && !ACCESS_CODES.has(hashedCode) && !token) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      },
      {
        status: 401,
      },
    );
  }

  // inject api key
  if (!token) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      // console.log("[Auth] set system token");
      req.headers.set("token", apiKey);
    } else {
      return NextResponse.json(
        {
          error: true,
          msg: "Empty Api Key",
        },
        {
          status: 401,
        },
      );
    }
  } else {
    console.log("[Auth] set user token");
  }
  // 打印记录

  try {
    const payload = await req.json()
    const messages = payload.messages || []
    if (messages.length === 0) {
      return
    }
    let totalLength = 0
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (message && message.content) {
        totalLength += message.content.length
      }
    }
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.content) {
      const truncatedLastMessage = lastMessage.content.substring(0, 500)
      console.log(`[${new Date()}chat:${totalLength},len:${lastMessage.content.length}]${truncatedLastMessage}`)
    } else {
      console.warn('Cannot retrieve last message')
    }
  } catch (e) {
    console.error('Error:', e)
  }


  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
