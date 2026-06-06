import { DEFAULT_EMPTY_CELL_VALUE } from "utilities/constants";
import { isPendingEnrollment } from "utilities/hostUtils";

/**
 * 获取主机状态提示文本
 * @param status - 主机状态
 * @returns 对应的提示文本
 */
export const getHostStatusTooltipText = (status: string): string => {
  if (status === "online") {
    return "Online hosts will respond to a live report.";
  }
  if (isPendingEnrollment(status)) {
    return "Device is pending enrollment in Apple Business and status is not yet available.";
  }
  return "Offline hosts won't respond to a live report because they may be shut down, asleep, or not connected to the internet.";
};

/**
 * 获取主机状态
 * @param status - 原始主机状态
 * @param mdmEnrollmentStatus - MDM 注册状态
 * @returns 处理后的主机状态
 */
export const getHostStatus = (
  status: string,
  mdmEnrollmentStatus?: string
): string => {
  if (mdmEnrollmentStatus === "Pending") {
    return DEFAULT_EMPTY_CELL_VALUE;
  }

  return status || DEFAULT_EMPTY_CELL_VALUE;
};
