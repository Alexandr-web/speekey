import fetch from "node-fetch";

export default () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZXhhbmRyIiwiZmF2b3JpdGVzIjpbMSwyLDNdLCJsZXZlbCI6NCwiZW1haWwiOiJhbGV4QG1haWwuY29tIiwiZXhwZXJpZW5jZSI6MTYsInBhc3N3b3JkIjoiJDJiJDA3JGY3eTNvTS5BMkwwSnpXcmxVMkFOUHVsbDhsWGJNR0IudFR4MFFCTXgxSDA5eUdLYjlZMUNXIiwic3BlZWQiOjQ2LCJhY2N1cmFjeSI6OTIsImlkIjoxLCJjcmVhdGVkQXQiOiIyMDIyLTA5LTExVDE0OjU1OjQ4LjMyN1oiLCJ1cGRhdGVkQXQiOiIyMDIyLTA5LTE0VDE2OjA5OjM3LjU4MloiLCJpYXQiOjE2NjM0MjE1ODQsImV4cCI6MzMyNjg0Njc2OH0.-UBXBItgoYGo0iUBPH6T9w60COUbZ18H9w8TliLqkzQ";
  const reqData = [
    {
      url: "http://localhost:3000/text/api/next/no-id",
      method: {
        name: "toBe",
        args: [403],
      },
    },
    {
      url: "http://localhost:3000/text/api/next/no-id",
      token,
      method: {
        name: "toBe",
        args: [400],
      },
    },
    {
      url: "http://localhost:3000/text/api/next/1",
      token,
      method: {
        name: "toBe",
        args: [200],
      },
    },
    {
      url: "http://localhost:3000/text/api/next/13213213123123213131",
      token,
      method: {
        name: "toBe",
        args: [404],
      },
    }
  ];

  return reqData.map(({ url, token: tokenKey, method, }) => {
    return {
      promise: fetch(url, {
        method: "GET",
        headers: {
          "Accept-Type": "application/json",
          Authorization: `Bearer ${tokenKey || ""}`,
        },
      }),
      method,
    };
  });
};