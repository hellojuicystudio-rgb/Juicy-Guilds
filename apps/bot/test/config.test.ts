import assert from "node:assert/strict";
import test from "node:test";

import { readBotCredentials } from "../src/config.ts";

test("carrega os três bots nomeados", () => {
  const credentials = readBotCredentials({
    DISCORD_BOT_1_TOKEN: "one",
    DISCORD_BOT_2_TOKEN: "two",
    DISCORD_BOT_3_TOKEN: "three",
  });

  assert.deepEqual(credentials.map(({ label }) => label), ["Bot 1", "Bot 2", "Bot 3"]);
});

test("usa o token principal como fallback", () => {
  assert.equal(readBotCredentials({ DISCORD_BOT_TOKEN: "primary" }).length, 1);
});
