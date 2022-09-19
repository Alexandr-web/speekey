import fetch from "node-fetch";
import jwtDecode from "jwt-decode";

export default () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZXhhbmRyIiwiZmF2b3JpdGVzIjpbMSwyLDNdLCJsZXZlbCI6NCwiZW1haWwiOiJhbGV4QG1haWwuY29tIiwiZXhwZXJpZW5jZSI6MTYsInBhc3N3b3JkIjoiJDJiJDA3JGY3eTNvTS5BMkwwSnpXcmxVMkFOUHVsbDhsWGJNR0IudFR4MFFCTXgxSDA5eUdLYjlZMUNXIiwic3BlZWQiOjQ2LCJhY2N1cmFjeSI6OTIsImlkIjoxLCJjcmVhdGVkQXQiOiIyMDIyLTA5LTExVDE0OjU1OjQ4LjMyN1oiLCJ1cGRhdGVkQXQiOiIyMDIyLTA5LTE0VDE2OjA5OjM3LjU4MloiLCJpYXQiOjE2NjM0MjE1ODQsImV4cCI6MzMyNjg0Njc2OH0.-UBXBItgoYGo0iUBPH6T9w60COUbZ18H9w8TliLqkzQ";
  const { id, } = jwtDecode(token);
  const reqData = [
    {
      url: `http://localhost:3000/profile/${id}/favorites/remove`,
      method: {
        name: "toBe",
        args: [403],
      },
    },
    {
      url: "http://localhost:3000/profile/no-id/favorites/remove",
      token,
      method: {
        name: "toBe",
        args: [400],
      },
    },
    {
      url: "http://localhost:3000/profile/no-id/favorites/remove",
      method: {
        name: "toBe",
        args: [403],
      },
    }
  ];

  return reqData.map(({ url, method, token: tokenKey, }) => {
    return {
      promise: fetch(url, {
        method: "DELETE",
        headers: {
          "Accept-Type": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenKey || ""}`,
        },
      }),
      method,
    };
  });
};