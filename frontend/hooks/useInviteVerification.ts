import { useQuery } from "react-query";
import { AxiosError } from "axios";

import inviteAPI, { IValidateInviteResponse } from "services/entities/invites";
import { IInvite } from "interfaces/invite";
import { DEFAULT_USE_QUERY_OPTIONS } from "utilities/constants";

interface UseInviteVerificationResult {
  data: IInvite | undefined;
  isLoading: boolean;
  error: AxiosError | null;
}

const useInviteVerification = (
  inviteToken: string
): UseInviteVerificationResult => {
  const { data, isLoading, error } = useQuery<
    IValidateInviteResponse,
    AxiosError,
    IInvite
  >(
    "invite",
    () => inviteAPI.verify(inviteToken),
    {
      ...DEFAULT_USE_QUERY_OPTIONS,
      retry: 2,
      select: (response: IValidateInviteResponse) => response.invite,
    }
  );

  return { data, isLoading, error };
};

export default useInviteVerification;
