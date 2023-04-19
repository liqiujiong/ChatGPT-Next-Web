import { getItem } from "@/app/utils";

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
export const authFetch = async (path:string, params:any = null, body:any = null) => {

  const token = getItem("jwt");
  const headers = {
    token: `${token}`
  } as any
  if (params) {
    path = `${path}?` + new URLSearchParams(params)
  } else {
    path = `${path}`
  }

  const options = {
    headers
  } as RequestInit
  if (body) {
    options.method = 'POST'
    options.body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  const response = await (await fetch(path, options)).json()
  return response
}

export const fetchLoginStatus = async (scene_value: string) => {
  const response = await (
    await fetch(`/hehe/wx/LoginStatus?wechat_flag=${scene_value}`)
  ).json();
  return response as {
    success: boolean;
    data: { token: string; user: IUser };
    msg?: string;
    status: number;
  };
};

export const fetchQrCodeUrl = async () => {
  const response = await (await fetch("/hehe/wx/QrCode")).json();
  return response as {
    success: boolean;
    data: { qrcode_url: string; scene_value: string };
    msg?: string;
  };
};

export const fetchUserInfo = async () => {
  const response = await authFetch('/hehe/user/current')
  return response as {
    success: boolean;
    data: IUser;
    msg?: string;
  };
};
