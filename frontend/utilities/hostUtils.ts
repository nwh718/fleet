import { DEFAULT_EMPTY_CELL_VALUE } from "utilities/constants";

/**
 * Returns whether a host should be treated as pending enrollment.
 * @param value The status-like value to evaluate.
 */
export const isPendingEnrollment = (value?: string): boolean => {
    return value === DEFAULT_EMPTY_CELL_VALUE || value === "Pending";
};
