import React, { createContext, useMemo, useContext, useState } from "react";
import styles from "../index.module.scss";
import { useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { ChatApiState } from "../../../store/chatApiSlice";
import BubbleType from "./BubbleType";
import Avatar from "../../../components/Avatar/Avatar";

type Props = {
  type: "system" | "user" | "err";
  message: string;
  time: string;
  showAll: boolean;
  id: number;
};
export const ChatBubbleContext = createContext<[string, number]>(["", -1]);
const ChatBubble = ({ showAll, time, type, message, id }: Props) => {
  const style = useMemo(() => ({ system: styles.bubbleContainerBot, user: styles.bubbleContainerUser, err: styles.bubbleContainerBot }), []);
  const { currChatType } = useSelector((state: ChatApiState) => state.chatApi);

  const BubbleRight = () => (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Avatar
        shape="square"
        style={{
          alignSelf: "flex-end",
          marginBottom: "5px",
          marginRight: "5px",
        }}
        size="small"
        type="user"
      />
      <div className={`${style[type]} `}>
        <div className={styles.chatBubble}>
          {message ? (
            <>
              <BubbleType showAll={true} type="user" />
            </>
          ) : (
            <Loading size={8} />
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
  const BubbleLeft = () => {
    const PublicElem = ({ showAll = true }: { typeChat?: string; showAll?: boolean }) => {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
          <Avatar
            size="small"
            shape="square"
            style={{
              marginBottom: "5px",
              marginLeft: "5px",
            }}
            type="system"
          />
          <div className={style[type]}>
            <div className={`${styles.chatBubble}`}>{message ? <BubbleType type={type} showAll={showAll} /> : <Loading size={8} />}</div>

            <div className={styles.time}>{time}</div>
          </div>{" "}
        </div>
      );
    };
    const BotBubble = ({ type }: { type: "oral" | "text" }) => {
      return {
        oral: <PublicElem typeChat={type} showAll={showAll} />,
        text: <PublicElem />,
      }[type];
    };

    return <BotBubble type={currChatType} />;
  };

  return (
    <ChatBubbleContext.Provider value={[message, id]}>
      {type === "user" ? (
        <>
          <BubbleRight />
        </>
      ) : (
        <BubbleLeft />
      )}
    </ChatBubbleContext.Provider>
  );
};

export default ChatBubble;
