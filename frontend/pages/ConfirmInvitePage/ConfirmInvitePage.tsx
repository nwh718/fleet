import React, { useCallback, useContext } from "react";
import { InjectedRouter } from "react-router";
import { Params } from "react-router/lib/Router";

import { AppContext } from "context/app";
import { NotificationContext } from "context/notification";
import { ICreateUserWithInvitationFormData } from "interfaces/user";
import paths from "router/paths";
import usersAPI from "services/entities/users";
import AuthenticationFormWrapper from "components/AuthenticationFormWrapper";
import Spinner from "components/Spinner";
import ConfirmInviteForm from "components/forms/ConfirmInviteForm";
import { IConfirmInviteFormData } from "components/forms/ConfirmInviteForm/ConfirmInviteForm";
import { getErrorReason } from "interfaces/errors";
import useInviteVerification from "hooks/useInviteVerification";

interface IConfirmInvitePageProps {
  router: InjectedRouter;
  params: Params;
}

const baseClass = "confirm-invite-page";

const ConfirmInvitePage = ({ router, params }: IConfirmInvitePageProps) => {
  const { invite_token } = params;
  const { currentUser } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);

  const {
    data: validInvite,
    error: validateInviteError,
    isLoading: isVerifyingInvite,
  } = useInviteVerification(invite_token);

  const onSubmit = useCallback(
    async (formData: IConfirmInviteFormData) => {
      const dataForAPI: ICreateUserWithInvitationFormData = {
        email: validInvite?.email || "",
        name: formData.name,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      try {
        await usersAPI.create(dataForAPI);
        renderFlash(
          "success",
          "Account created successfully. Please sign in."
        );
        router.push(paths.LOGIN);
      } catch (error) {
        const reason = getErrorReason(error);
        console.error(reason);
        renderFlash("error", reason);
      }
    },
    [invite_token, renderFlash, router, validInvite?.email]
  );

  if (currentUser) {
    router.push(paths.DASHBOARD);
    return <></>;
  }

  const renderContent = () => {
    if (isVerifyingInvite) {
      return <Spinner />;
    }

    if (validateInviteError) {
      return (
        <p className={`${baseClass}__description`}>
          This invite token is invalid. Please confirm your invite link.
        </p>
      );
    }

    return (
      <>
        <p className={`${baseClass}__description`}>
          Before you get started, please take a moment to complete the following
          information.
        </p>
        <ConfirmInviteForm
          defaultFormData={{
            name: validInvite?.name,
          }}
          handleSubmit={onSubmit}
        />
      </>
    );
  };

  return (
    <AuthenticationFormWrapper
      header={validateInviteError ? "Invalid invite token" : "Welcome to Fleet"}
      className={baseClass}
    >
      {renderContent()}
    </AuthenticationFormWrapper>
  );
};

export default ConfirmInvitePage;
