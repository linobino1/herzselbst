export const env = () => {
  return typeof window !== "undefined" ? window.ENV : process.env;
};
