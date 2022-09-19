import { test, describe, } from "@jest/globals";
import requestHandler from "../requestHandler";
import { getRandom, getOne, getNext, createText, setFavorite, } from "../functions/text/index";

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

  test("Create", () => {
    requestHandler(createText());
  });

  test("Set favorite", () => {
    requestHandler(setFavorite());
  });
});