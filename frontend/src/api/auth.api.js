import api from "./axios";

export const loginApi = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const signupApi = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const signupWithOtp = async (data) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const resendOtp = async () => {
  const res = await api.post("/auth/resend-otp");
  return res.data;
};

export const logoutApi = async () => {
  await api.post("/auth/logout", {}, {});
};

export const getMeApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
