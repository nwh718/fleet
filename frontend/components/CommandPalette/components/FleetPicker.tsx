import React from "react";
import { Command } from "cmdk";

import { ITeamSummary } from "interfaces/team";


const baseClass = "command-palette";

interface IFleetPickerProps {
  availableTeams?: ITeamSummary[];
  currentTeam?: ITeamSummary;
  search: string;
  onSelect: (fleetId: number) => void;
}

const FleetPicker = ({
  availableTeams,
  currentTeam,
  search,
  onSelect,
}: IFleetPickerProps): JSX.Element => {
  return (
            value={fleet.name}
            onSelect={() => onSelect(fleet.id)}
      {availableTeams?.map((fleet) => {
          >
            <span
              className={`${baseClass}__item-label${
                isSelected ? ` ${baseClass}__item-label--selected` : ""
              }`}
            >
              <HighlightedLabel text={fleet.name} query={search} />
            </span>
          </Command.Item>
        );
      })}
    </Command.Group>
  );
};

export default FleetPicker;
