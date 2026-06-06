import { DEFAULT_EMPTY_CELL_VALUE } from "utilities/constants";
import { isPendingEnrollment } from "utilities/hostUtils";

/**
 * Returns the tooltip text shown for a host status indicator.
 * @param status The host status value displayed in the UI.
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
 * Returns the host status shown in the UI, including pending enrollment handling.
 * @param status The status reported for the host.
 * @param mdmEnrollmentStatus The MDM enrollment status for the host, if available.
 */
export const getHostStatus = (
  status: string,
  mdmEnrollmentStatus?: string
): string => {
  if (isPendingEnrollment(mdmEnrollmentStatus)) {
    return DEFAULT_EMPTY_CELL_VALUE;
  }

  return status || DEFAULT_EMPTY_CELL_VALUE;
};
