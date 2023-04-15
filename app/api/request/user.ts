import { getItem } from "@/app/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8088";

const SELF_DOMAIN = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

export interface IUser {
  wechat_openid: string;
  coin: number;
  type: number;
  count: number;
  phone?: string;
  wechat?: string;
  nickname?: string;
  real_name?: string;
  exp_time?: string;
  id?: number;
  id_card?: string;
  is_block?: boolean;
  pay_account?: string;
  create_time?: number;
  email?: string;
  cash?: number;
  update_time?: number;
  school?: string;
  cash_extract?: number;
}
/**
 * 用户接口
 */
export const authFetch = async (
  path: string,
  params: any = null,
  body: any = null,
) => {
  const token = getItem("jwt");
  const headers = {
    token: `${token}`,
    origin: SELF_DOMAIN,
  } as any;
  if (params) {
    path = API_URL + `${path}?` + new URLSearchParams(params);
  } else {
    path = API_URL + `${path}`;
  }

  const options = {
    headers,
  } as RequestInit;
  if (body) {
    options.method = "POST";
    options.body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const response = await (await fetch(path, options)).json();
  return response;
};

export const fetchLoginStatus = async (scene_value: string) => {
  const options = {
    headers: {
      origin: SELF_DOMAIN,
    },
  };
  const response = await (
    await fetch(API_URL + `/wx/LoginStatus?wechat_flag=${scene_value}`,options)
  ).json();
  return response as {
    success: boolean;
    data: { token: string; user: IUser };
    msg?: string;
    status: number;
  };
};

export const fetchQrCodeUrl = async () => {
  const options = {
    headers: {
      origin: SELF_DOMAIN,
    },
  };
  const response = await (await fetch(API_URL + "/wx/QrCode",options)).json();
  return response as {
    success: boolean;
    data: { qrcode_url: string; scene_value: string };
    msg?: string;
  };
};

export const fetchUserInfo = async () => {
  // const response = await (await fetch(API_URL + "/user/current")).json();
  const response = await authFetch("/user/current");
  return response as {
    success: boolean;
    data: IUser;
    msg?: string;
  };
};
