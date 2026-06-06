import { useQuery } from "react-query";
import { AxiosError } from "axios";

import inviteAPI, { IValidateInviteResponse } from "services/entities/invites";
import { IInvite } from "interfaces/invite";
import { DEFAULT_USE_QUERY_OPTIONS } from "utilities/constants";

interface IUseInviteVerificationReturn {
    data: IInvite | undefined;
    isLoading: boolean;
    error: AxiosError | null;
}

const useInviteVerification = (inviteToken: string): IUseInviteVerificationReturn => {
    const { data, isLoading, error } = useQuery<IValidateInviteResponse, AxiosError, IInvite>(
        ["invite", inviteToken],
        () => inviteAPI.verify(inviteToken),
        {
            ...DEFAULT_USE_QUERY_OPTIONS,
            retry: 2,
            select: (resp: IValidateInviteResponse) => resp.invite,
        }
    );

    return { data, isLoading, error };
};

export default useInviteVerification;
