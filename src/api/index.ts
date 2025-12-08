import axios, { AxiosInstance } from "axios";
import { getJwtTokens, setJwtTokens } from "../token"; // Your vscode settings-based token functions

export default class API {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!API.instance) {
      API.instance = axios.create({
        baseURL: "https://app.rastai.ai/api/",
        headers: {
          "Content-Type": "application/json",
        },
      });

      API.registerInterceptors();
    }

    return API.instance;
  }

  private static registerInterceptors(): void {
    API.instance.interceptors.request.use(
      (config) => {
        const { codeTraceToken } = getJwtTokens();
        console.log("codeTraceToken: ", codeTraceToken);
        if (codeTraceToken) {
          // Set the access token as a Authorization
          config.headers["Authorization"] = `Bearer ${codeTraceToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // API.instance.interceptors.response.use(
    //   (res) => res,
    //   async (error) => {
    //     const originalRequest = error.config;

    //     // Prevent infinite loop
    //     if (
    //       error.response?.status !== 401 ||
    //       originalRequest._retry
    //     ) {
    //       return Promise.reject(error);
    //     }

    //     // Mark request to prevent re-entry
    //     originalRequest._retry = true;

    //     const { refresh } = getJwtTokens();
    //     if (!refresh) {
    //       return Promise.reject(error);
    //     }

    //     try {
    //       const { data } = await axios.post("token/refresh/", {
    //         refresh,
    //       });

    //       const { access, refresh: _refresh } = data;

    //       // Store new tokens
    //       setJwtTokens(access, _refresh);

    //       // Re-attach updated token as cookie
    //       originalRequest.headers["Cookie"] = `next-auth.session-token=${access}`;

    //       // Retry original request
    //       return API.instance(originalRequest);
    //     } catch (refreshError) {
    //       return Promise.reject(refreshError);
    //     }
    //   }
    // );
  }
}