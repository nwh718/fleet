import { DEFAULT_EMPTY_CELL_VALUE } from "utilities/constants";

/**
 * 检查主机状态是否为待注册状态
 * @param status - 主机状态
 * @returns 如果是待注册状态则返回 true
 */
export const isPendingEnrollment = (status: string): boolean => {
    return status === DEFAULT_EMPTY_CELL_VALUE;
};
