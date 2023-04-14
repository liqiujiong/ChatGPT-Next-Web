"use client";
// http://img.xjishu.com/img/zl/2017/10/212257159687020.gif
import { useState, useEffect, useRef } from "react";
import styles from "./login.module.scss";
import CloseIcon from "../icons/close.svg";
import Image from "next/image";
import LoadingIcon from "../icons/three-dots.svg";

interface LoginProps {}

interface LoginStatusResponse {
  isLoggedIn: boolean;
}

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

const Test_API = "https://aitop.lqjhome.cn/api";
export function Login(props: LoginProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fileContents, setFileContents] = useState("");
  const [agreed, setAgreed] = useState(false);
  const scene_value = useRef("");
  const interval = useRef({} as NodeJS.Timer);
  const getQrCodeUrl = async () => {
    const response = await (await fetch(Test_API + "/wx/QrCode")).json();
    const data = response.data as { qrcode_url: string; scene_value: string };
    scene_value.current = data.scene_value;
    setQrCodeUrl(data.qrcode_url);
  };

  const checkLoginStatus = async () => {
    const response = await (
      await fetch(
        Test_API + `/wx/LoginStatus?wechat_flag=${scene_value.current}`,
      )
    ).json();
    const data = response as {
      success: boolean;
      data: { token: string };
      msg?: string;
    };
    console.log("data response:>> ", response);
    if (data.success == true) {
      setIsLoggedIn(true);
      clearInterval(interval.current);
      console.log("token :>> ", data.data.token);
    } else {
      console.log("msg:", data.msg);
    }
  };

  async function getFileContents() {
    const response = await fetch("/user_agree.txt");
    const text = await response.text();
    setFileContents(text);
  }

  useEffect(() => {
    if (agreed) {
    //   getQrCodeUrl();
    //   interval.current = setInterval(() => {
    //     checkLoginStatus();
    //   }, 2000);
    } else {
      getFileContents();
    }
    return () => {
    //   clearInterval(interval.current);
    };
  }, [agreed]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLoggedIn) {
    }
  }, [isLoggedIn]);
  console.log(qrCodeUrl);

  const Agree = () => {
    return (
      <div className={styles["agree-box"]}>
        <pre>{fileContents}</pre>
        <label style={{ display: "flex", alignItems: "center" , justifyContent:"end"}}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            style={{ margin: "0 10px 0 0" }}
          />
          <a
            href="/user_agree.txt"
            target="_blank"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            本人已阅读并同意《用户协议》
          </a>
        </label>
      </div>
    );
  };

  const Scan = () => {
    return (
      <>
        {qrCodeUrl && (
          <Image
            src={qrCodeUrl}
            alt="qrcode"
            placeholder="empty"
            className={styles["qrcode-img"]}
            width={170}
            height={170}
          />
        )}

        {!qrCodeUrl && <LoadingIcon className={styles["qrcode-img"]} />}
        <div className={styles["box-text"]}>使用微信扫码登录</div>
      </>
    );
  };

  return (
    <>
      {!agreed && (
        <div className="modal-mask">
          <Modal title="用户协议">
            <div className={styles["box-style"]}>
              {!agreed && <Agree />}
              {/* {agreed && <Scan />} */}
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}
