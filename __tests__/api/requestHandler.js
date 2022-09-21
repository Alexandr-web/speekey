import { expect, } from "@jest/globals";

export default (reqData) => {
  reqData.map(({ promise, code, }) => {
    promise.then(({ status, }) => {
      expect(status).toBe(code);
    });
  });
};