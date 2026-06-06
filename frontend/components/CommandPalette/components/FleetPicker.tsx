import React from "react";
import { Command } from "cmdk";

import { ITeamSummary } from "interfaces/team";

import useLazyItems from "./useLazyItems";
import HighlightedLabel from "./HighlightedLabel";

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
  const {
    visibleItems: visibleFleets,
    hasMore,
    sentinelRef,
  } = useLazyItems({ items: availableTeams ?? [] });

  return (
    <Command.Group className={`${baseClass}__group`}>
      {visibleFleets.map((fleet) => {
        const isSelected = fleet.id === currentTeam?.id;
        return (
          <Command.Item
            key={`fleet-${fleet.id}`}
            value={fleet.name}
            onSelect={() => onSelect(fleet.id)}
            className={`${baseClass}__item`}
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
      {hasMore && (
        <span
          ref={sentinelRef}
          className={`${baseClass}__list-sentinel`}
          aria-hidden
        >
          {"\u200B"}
        </span>
      )}
    </Command.Group>
  );
};

export default FleetPicker;
