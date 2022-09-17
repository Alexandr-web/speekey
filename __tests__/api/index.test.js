import { expect, test, describe, } from "@jest/globals";
import { getFavorites, getCompletedTexts, } from "./functions/user/index";
import { getRandom, getOne, getNext, } from "./functions/text/index";

describe("Profile api", () => {
  test("Get completed texts", () => {
    const reqData = getCompletedTexts();

    reqData.map(({ promise, method, }) => {
      promise.then(({ status, }) => {
        expect(status)[method.name](...method.args);
      });
    });
  });

  test("Get favorites", () => {
    const reqData = getFavorites();

    reqData.map(({ promise, method, }) => {
      promise.then(({ status, }) => {
        expect(status)[method.name](...method.args);
      });
    });
  });
});

describe("Text api", () => {
  test("Get random", () => {
    const reqData = getRandom();

    reqData.map(({ promise, method, }) => {
      promise.then(({ status, }) => {
        expect(status)[method.name](...method.args);
      });
    });
  });

  test("Get one", () => {
    const reqData = getOne();

    reqData.map(({ promise, method, }) => {
      promise.then(({ status, }) => {
        expect(status)[method.name](...method.args);
      });
    });
  });

  test("Get next", () => {
    const reqData = getNext();

    reqData.map(({ promise, method, }) => {
      promise.then(({ status, }) => {
        expect(status)[method.name](...method.args);
      });
    });
  });
});