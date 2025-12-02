import { CtrlAgent } from "./agent";
import { TaskStatus } from "./types/agent/types";

export { TaskStatus, CtrlAgent };
export default CtrlAgent;

// For CommonJS compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = CtrlAgent;
  module.exports.CtrlAgent = CtrlAgent;
  module.exports.TaskStatus = TaskStatus;
  module.exports.default = CtrlAgent;
}
