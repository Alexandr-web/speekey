import { test, describe, } from "@jest/globals";
import requestHandler from "../requestHandler";
import { getFavorites, getCompletedTexts, removeFavorites, setTextComplete, editProfile, levelUpdate, } from "../functions/user/index";

describe("Profile api", () => {
  test("Get completed texts", () => {
    requestHandler(getCompletedTexts());
  });

  test("Get favorites", () => {
    requestHandler(getFavorites());
  });

  test("Remove favorites", () => {
    requestHandler(removeFavorites());
  });

  test("Set text complete", () => {
    requestHandler(setTextComplete());
  });

  test("Edit", () => {
    requestHandler(editProfile());
  });

  test("Level update", () => {
    requestHandler(levelUpdate());
  });
});