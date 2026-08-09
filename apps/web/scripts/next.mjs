import { spawn } from "node:child_process";
import { loadEnvFile } from "node:process";

const nextArguments = process.argv.slice(2);
if (nextArguments.length === 0) throw new Error("Comando Next.js ausente");

loadEnvFile("../../.env");

const child = spawn(
  process.execPath,
  ["./node_modules/next/dist/bin/next", ...nextArguments],
  { env: process.env, stdio: "inherit" },
);

child.once("exit", (code, signal) => {
  if (signal) {
    console.error(`Next.js encerrado pelo sinal ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
