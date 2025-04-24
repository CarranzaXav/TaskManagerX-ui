import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        const { accessToken } = response;
        if (accessToken) {
          return accessToken;
        } else {
          console.error("No accessToken found in refresh response.");
          throw new Error("No accessToken returned");
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken = data?.accessToken || data;
          if (accessToken) {
            dispatch(setCredentials({ accessToken }));
            // console.log('Access token set: ', accessToken);
          } else {
            console.error("No accessToken found in refresh response.");
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
