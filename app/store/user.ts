import create from 'zustand'
import { persist } from 'zustand/middleware'
import { StoreKey } from '../constant'
import { IUser } from '../api/request/user';

export interface UserStore {
  token: string | null;
  user: IUser;
  // getQrCord: ()=>Promise<void>
  // getLoginStatus:()=>Promise<void>
  // getUserInfo: (token: string) => Promise<void>;
  setToken: (token: string | null) => void
  setUser: (user: IUser) => void
}

export const useUserStore = create<UserStore>()(

  persist(
    (set, get) => ({
      token: null,
      user: {
        wechat_openid: "",
        coin: 0,
        type: 0,
        count: 0,
      },
      setToken(token) {
        set({
          token
        })
      },
      setUser(user) {
        set({
          user
        })
      }
    }),
    {
      name: StoreKey.User, // 存储localStorage的键名
      version: 1,
    }
  )
)

export default useUserStore
