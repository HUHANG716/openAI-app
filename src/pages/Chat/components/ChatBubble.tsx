import React, { createContext, useMemo, useContext, useState } from "react";
import styles from "../index.module.scss";
import { useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";

import { ChatApiState } from "../../../store/chatApiSlice";

import BubbleType from "./BubbleType";
type Props = {
  type: "system" | "user" | "err";
  message: string;
  time: string;
  showAll: boolean;
  audioURL: string;
};
export const ChatBubbleContext = createContext<[string, string]>(["", ""]);
const ChatBubble = ({ audioURL, showAll, time, type, message }: Props) => {
  const style = useMemo(() => ({ system: styles.bubbleContainerBot, user: styles.bubbleContainerUser, err: styles.bubbleContainerBot }), []);
  const { currChatType } = useSelector((state: ChatApiState) => state.chatApi);

  const BubbleRight = () => (
    <div className={`${style[type]} `}>
      <div className={styles.chatBubble}>{message ? message : <Loading size={8} />}</div>
      <div></div>
    </div>
  );
  const BubbleLeft = () => {
    const PublicElem = ({ typeChat = "text", showAll = true }: { typeChat?: string; showAll?: boolean }) => {
      const [isShown, setIsShown] = useState(false);
      const handleClick = () => {
        return {
          oral: () => {
            setIsShown(true);
          },
          text: () => {},
        }[typeChat];
      };
      const style_chatBubbleShown = () => {
        if (isShown || showAll) return styles.chatBubbleShown;
        return "";
      };
      return (
        <div className={style[type]}>
          <div onClick={handleClick} className={`${styles.chatBubble} ${style_chatBubbleShown()}`}>
            {message ? <BubbleType type={type} /> : <Loading size={8} />}
          </div>

          <div className={styles.time}>{time}</div>
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

  return <ChatBubbleContext.Provider value={[audioURL, message]}>{type === "user" ? <BubbleRight /> : <BubbleLeft />}</ChatBubbleContext.Provider>;
};

export default ChatBubble;
