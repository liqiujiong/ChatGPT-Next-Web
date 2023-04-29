"use client";
// http://img.xjishu.com/img/zl/2017/10/212257159687020.gif
import { useState, useEffect, useRef } from "react";
import styles from "./login.module.scss";
import CloseIcon from "../icons/close.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { useUserStore } from "../store";
import {
  fetchLoginStatus,
  fetchQrCodeUrl,
  fetchUserInfo,
} from "../api/request/user";
import { showToast } from "./ui-lib";
import { getItem, setItem } from "../utils";

interface LoginProps { }


interface ModalProps {
  title: string;
  children?: JSX.Element;
  actions?: JSX.Element[];
  onClose?: () => void;
}
export function Modal(props: ModalProps) {
  return (
    <div className={styles["modal-container"]}>
      <div className={styles["modal-header"]}>
        <div className={styles["modal-title"]}>{props.title}</div>

        {props.onClose && (
          <div className={styles["modal-close-btn"]} onClick={props.onClose}>
            <CloseIcon />
          </div>
        )}
      </div>

      <div className={styles["modal-content"]}>{props.children}</div>

      {props.actions && (
        <div className={styles["modal-footer"]}>
          <div className={styles["modal-actions"]}>
            {props.actions?.map((action, i) => (
              <div key={i} className={styles["modal-action"]}>
                {action}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Login(props: LoginProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [expire, setExpire] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const scene_value = useRef("");
  const interval = useRef({} as NodeJS.Timer);

  const userStore = useUserStore()
  const checkLogin = async () => {
    const token = getItem("jwt");
    userStore.setToken(token)
    if (token) {
      const res = await fetchUserInfo();
      if (res.success) {
        const data = res.data;
        userStore.setToken(token)
        userStore.setUser(data)
        showToast("欢迎回来", undefined, 1000);
      } else {
        const msg = res.msg;
        showToast((msg as string) + ",请重新登录");
        setItem("jwt", "");
        userStore.setToken("")
      }
    }
  };

  const getQrCodeUrl = async () => {
    setQrCodeUrl("");
    setExpire(false);
    const res = await fetchQrCodeUrl();
    const data = res.data;
    scene_value.current = data.scene_value;
    setQrCodeUrl(data.qrcode_url);
  };

  const checkLoginStatus = async () => {
    const res = await fetchLoginStatus(scene_value.current);

    if (res.success == true) {
      clearInterval(interval.current);
      const data = res.data;
      userStore.setToken(data.token)
      userStore.setUser(data.user)
      console.log("token :>> ", data.token);
      setItem("jwt", data.token);
      showToast("登录成功,欢迎回来", undefined, 1000);
    } else {
      console.log("msg:", res.msg);
      if (res.status == 1009) {
        clearInterval(interval.current);
        showToast("登录超时,请重新刷新二维码");
        setQrCodeUrl("");
        setExpire(true);
      }
    }
  };

  async function getFileContents() {
    const response = await fetch("/user_agree.txt");
    const text = await response.text();
    setFileContents(text);
  }

  useEffect(() => {
    checkLogin();
    return () => { };
  }, []);

  useEffect(() => {
    if (agreed && !userStore.token) {
      getQrCodeUrl();

    } else {
      getFileContents();
    }
  }, [agreed, userStore.token]);

  useEffect(() => {
    if (qrCodeUrl) {
      interval.current = setInterval(() => {
        checkLoginStatus();
      }, 2000);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [qrCodeUrl]);

  const Agree = () => {
    return (
      <div className={styles["agree-box"]}>
        <pre>{fileContents}</pre>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            style={{ margin: "0 10px 0 0" }}
          />
          <text>本人已阅读并同意《用户协议》</text>
        </label>
      </div>
    );
  };

  const Scan = () => {
    return (
      <>
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="qrcode"
            placeholder="empty"
            className={styles["qrcode-img"]}
            width={170}
            height={170}
          />
        )}

        {!qrCodeUrl && !expire && (
          <LoadingIcon className={styles["qrcode-img"]} />
        )}
        {expire && (
          <div
            className={styles["qrcode-img"]}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ alignItems: "center" }}>二维码过期, 请刷新</div>

          </div>
        )}
        <div className={styles["box-text"]}>
          <text>使用微信扫码登录</text>
          <div>(长按识别或截图)</div>
        </div>
        <a onClick={getQrCodeUrl}>刷新二维码</a>
      </>
    );
  };

  return (
    <>
      {!userStore.token && (
        <div className="modal-mask">
          <Modal title="登录">
            <div className={styles["box-style"]}>
              {!agreed && <Agree />}
              {agreed && <Scan />}
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}
