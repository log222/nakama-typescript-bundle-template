import { greeting } from "./greeting";

const hello: nkruntime.RpcFunction = function (ctx, logger, nk, payload) {
  const data = payload ? JSON.parse(payload) : {};
  logger.info("hello rpc called by %s", ctx.userId || "http_key");
  return JSON.stringify({ message: greeting(data.name) });
};

// Nakama looks for a GLOBAL function called InitModule. The build script keeps it global.
export function InitModule(
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  initializer: nkruntime.Initializer
): void {
  initializer.registerRpc("hello", hello);
  logger.info("Module loaded");
}
