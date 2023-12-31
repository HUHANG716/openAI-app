import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { err } from "../utils/alert";
import axiosInstance, { apiBaseUrl } from "../config/axiosConfig";
import { isAxiosError } from "axios";

export type Language = "English" | "Français" | "Deutsch" | "日本語" | "한국어" | "中文";
export interface AiTranslateApiRequestDto {
  text: string;
  language: Language;
}
interface AiTranslateApiResponse {
  choices: Array<{
    text: string;
  }>;
}

interface AiTranslateSliceState {
  language: Language;
  text: string;
  result: string;
}
export interface AiTranslateState {
  aiTranslate: AiTranslateSliceState;
}
export const getTranslatedResult = createAsyncThunk("aiTranslateApi/getTranslatedResult", async (drawRequestDto: AiTranslateApiRequestDto, { rejectWithValue }) => {
  const translateUrl = import.meta.env.VITE_TRANSLATE_URL;
  try {
    const response = await axiosInstance.post(apiBaseUrl + translateUrl, drawRequestDto);
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

const initialState: AiTranslateSliceState = {
  language: "English",
  text: "",
  result: "",
};
export const aiTranslateApiSlice = createSlice({
  name: "aiTranslate",
  initialState,
  reducers: {
    setLanguage: (
      state,
      action: {
        payload: Language;
      }
    ) => {
      state.language = action.payload;
    },
    setText: (state, action) => {
      state.text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTranslatedResult.fulfilled, (state, action) => {
      console.log(action.payload?.data);
      const result = action.payload?.data?.choices[0]?.text;

      state.result = result.replace(/^\n+/, "");
      console.log("getTranslatedResult.fulfilled", action);
    });
    builder.addCase(getTranslatedResult.rejected, (state, action) => {
      switch (action.payload) {
        case 400:
          err("文本为空或长度超过限制");
          break;
        case 401:
          err("未登录或未授权");
          break;
        case 403:
          err("服务未开通或已过期");
          break;
        default:
          err("未知错误");
      }
      state.result = "翻译失败";
      console.log("getTranslatedResult.rejected", action);
    });
    builder.addCase(getTranslatedResult.pending, (state, action) => {
      state.result = "翻译中...";
      console.log("getTranslatedResult.pending", action);
    });
  },
});

export const { setLanguage, setText } = aiTranslateApiSlice.actions;
export default aiTranslateApiSlice.reducer;
