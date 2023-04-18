import React, { useEffect, useState } from "react";
import styles from "../index.module.scss";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { ChatApiState, RequestDto, RequestMessage, getBotMessages, sendUserMessage } from "../../store/chatApiSlice";
import { locations } from "../../localization";
import { ConfigState } from "../../store/configSlice";
import SendSharpIcon from "@mui/icons-material/SendSharp";
const InputRange = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const dispatch: Function = useDispatch();
  const { loading, currConversationId, validConversations, activeConversationId, model, maxContextNum } = useSelector((state: ChatApiState) => state.chatApi);
  const { location } = useSelector((state: ConfigState) => state.config);

  function handleClick() {
    console.log(userMessage);
    console.log(currConversationId);
    console.log(activeConversationId);
    if (loading === "loading") {
      return;
    }
    if (!userMessage) {
      return;
    }

    dispatch(sendUserMessage(userMessage));

    const messages: Array<RequestMessage> = [
      ...validConversations[currConversationId],
      {
        role: "user",
        content: userMessage,
      } as RequestMessage,
    ].slice(-1 * maxContextNum); //context
    console.log(messages);

    const requestDto: RequestDto = {
      cardId: currConversationId,
      model: model,
      messages: messages,
    };
    dispatch(getBotMessages(requestDto));

    setUserMessage("");
  }
  return (
    <div className={styles.inputRangeContainer}>
      <textarea
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            handleClick();
          }
        }}
        value={userMessage}
        onChange={(e) => {
          setUserMessage(e.target.value);
        }}
        className={styles.inputRange}
      />
      <div className={styles.buttonWrapper}>
        <Button className={`${styles.sendBtn} ${loading === "loading" ? styles.btnLoading : ""}`} onClick={handleClick} w={70} h={40}>
          <SendSharpIcon />
          {locations[location].send}
        </Button>
      </div>
    </div>
  );
};
export default InputRange;
