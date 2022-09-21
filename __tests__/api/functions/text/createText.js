import fetch from "node-fetch";

export default () => {
  const reqData = [
    {
      url: "http://localhost:3000/text/create",
      code: 403,
    }
  ];

  return reqData.map(({ url, token: tokenKey, code, }) => {
    return {
      promise: fetch(url, {
        method: "POST",
        headers: {
          "Accept-Type": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenKey || ""}`,
        },
      }),
      code,
    };
  });
};