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
import { useInviteVerification } from "hooks/useInviteVerification";

interface IConfirmInvitePageProps {
  router: InjectedRouter; // v3
  params: Params;
}

const baseClass = "confirm-invite-page";

const ConfirmInvitePage = ({ router, params }: IConfirmInvitePageProps) => {
  const { currentUser } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);
  const { invite_token } = params;

  const {
    data: validInvite,
    error: validateInviteError,
    isLoading: isVerifyingInvite,
  } = useInviteVerification(invite_token);

  const onSubmit = useCallback(
    async (formData: IConfirmInviteFormData) => {
      const dataForAPI: ICreateUserWithInvitationFormData = {
        email: validInvite?.email || "",
        invite_token,
        name: formData.name,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      try {
        await usersAPI.create(dataForAPI);
        router.push(paths.LOGIN);
        renderFlash(
          "success",
          "Registration successful! For security purposes, please log in."
        );
        // return for router typechecking
      } catch (error) {
        const reason = getErrorReason(error);
        console.error(reason);
        renderFlash("error", reason);
      }
    },
    [invite_token, renderFlash, router, validInvite?.email]
  );
  // error is how API communicates an invalid invite

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

  if (currentUser) {
    router.push(paths.DASHBOARD);
    return null;
  }

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
