package service

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"

	"github.com/fleetdm/fleet/v4/server/fleet"
)

func VerifyInstallToken(token string, deviceUDID string) (bool, error) {
	if len(token) != sha256.Size*2 {
		return false, fleet.NewPermissionError("invalid token")
	}
	if deviceUDID == "" {
		return false, fleet.NewPermissionError("invalid token")
	}

	tokenBytes, err := hex.DecodeString(token)
	if err != nil {
		return false, fleet.NewPermissionError("invalid token")
	}

	expected := sha256.Sum256([]byte(deviceUDID))
	if subtle.ConstantTimeCompare(tokenBytes, expected[:]) != 1 {
		return false, fleet.NewPermissionError("invalid token")
	}

	return true, nil
}
