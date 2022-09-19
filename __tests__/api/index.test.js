import { expect, test, describe, } from "@jest/globals";
import { getFavorites, getCompletedTexts, } from "./functions/user/index";
import { getRandom, getOne, getNext, } from "./functions/text/index";

const requestHandler = (reqData) => {
  reqData.map(({ promise, method, }) => {
    promise.then(({ status, }) => {
      expect(status)[method.name](...method.args);
    });
  });
};

describe("Profile api", () => {
  test("Get completed texts", () => {
    requestHandler(getCompletedTexts());
  });

  test("Get favorites", () => {
    requestHandler(getFavorites());
  });
});

describe("Text api", () => {
  test("Get random", () => {
    requestHandler(getRandom());
  });

  test("Get one", () => {
    requestHandler(getOne());
  });

  test("Get next", () => {
    requestHandler(getNext());
  });
});