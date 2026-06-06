import { useQuery } from "react-query";
import { AxiosError } from "axios";
import inviteAPI, { IValidateInviteResponse } from "services/entities/invites";
import { IInvite } from "interfaces/invite";
import { DEFAULT_USE_QUERY_OPTIONS } from "utilities/constants";

export const useInviteVerification = (inviteToken: string) => {
  const { data, error, isLoading } = useQuery<
    IValidateInviteResponse,
    AxiosError,
    IInvite
  >(
    "invite",
    () => inviteAPI.verify(inviteToken),
    {
      ...DEFAULT_USE_QUERY_OPTIONS,
      retry: 2,
      select: (resp: IValidateInviteResponse) => resp.invite,
    }
  );

  return { data, error, isLoading };
};
