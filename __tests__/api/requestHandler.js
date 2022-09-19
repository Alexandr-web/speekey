import { expect, } from "@jest/globals";

export default (reqData) => {
  reqData.map(({ promise, method, }) => {
    promise.then(({ status, }) => {
      expect(status)[method.name](...method.args);
    });
  });
};