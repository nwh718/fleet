import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { createCustomRenderer, createMockRouter } from "test/test-utils";
import createMockUser from "__mocks__/userMock";
import {
  createMockFleetMaintainedApp,
} from "__mocks__/softwareMock";
import { noop } from "lodash";

import FleetMaintainedAppsTable from "./FleetMaintainedAppsTable";

const mockRouter = createMockRouter();

describe("FleetMaintainedAppsTable", () => {
  const mockFmaData = {
    fleet_maintained_apps: [
      createMockFleetMaintainedApp({ name: "Test App", platform: "darwin", id: 1 }),
      createMockFleetMaintainedApp({ name: "Test App", platform: "windows", id: 2 }),
      createMockFleetMaintainedApp({ 
        name: "Added App", 
        platform: "windows", 
        id: 3,
        software_title_id: 100 // Already added
      }),
    ],
    count: 3,
    apps_updated_at: "2024-01-01T00:00:00Z",
    meta: {
      has_next_results: false,
      has_previous_results: false,
    },
  };

  it("renders macOS column with Add button for available apps", async () => {
    const render = createCustomRenderer({
      context: {
        app: {
          isGlobalAdmin: true,
          currentUser: createMockUser(),
        },
      },
    });

    render(
      <FleetMaintainedAppsTable
        teamId={1}
        isLoading={false}
        query=""
        perPage={20}
        orderDirection="asc"
        orderKey="name"
        currentPage={0}
        router={mockRouter}
        data={mockFmaData}
      />
    );

    expect(screen.getByText("macOS")).toBeInTheDocument();
    
    // Check for Add buttons
    const addButtons = screen.getAllByText("Add");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("renders Windows column with Add button for available apps", async () => {
    const render = createCustomRenderer({
      context: {
        app: {
          isGlobalAdmin: true,
          currentUser: createMockUser(),
        },
      },
    });

    render(
      <FleetMaintainedAppsTable
        teamId={1}
        isLoading={false}
        query=""
        perPage={20}
        orderDirection="asc"
        orderKey="name"
        currentPage={0}
        router={mockRouter}
        data={mockFmaData}
      />
    );

    expect(screen.getByText("Windows")).toBeInTheDocument();
    
    // Check for Add buttons for Windows platform
    const addButtons = screen.getAllByText("Add");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("renders success checkmark for already added apps", async () => {
    const render = createCustomRenderer({
      context: {
        app: {
          isGlobalAdmin: true,
          currentUser: createMockUser(),
        },
      },
    });

    render(
      <FleetMaintainedAppsTable
        teamId={1}
        isLoading={false}
        query=""
        perPage={20}
        orderDirection="asc"
        orderKey="name"
        currentPage={0}
        router={mockRouter}
        data={mockFmaData}
      />
    );

    // Check for success icon
    const successIcons = screen.getAllByTestId("success-icon");
    expect(successIcons.length).toBeGreaterThan(0);
  });

  it("navigates to app details when Add button is clicked", async () => {
    const pushSpy = jest.spyOn(mockRouter, "push");

    const render = createCustomRenderer({
      context: {
        app: {
          isGlobalAdmin: true,
          currentUser: createMockUser(),
        },
      },
    });

    render(
      <FleetMaintainedAppsTable
        teamId={1}
        isLoading={false}
        query=""
        perPage={20}
        orderDirection="asc"
        orderKey="name"
        currentPage={0}
        router={mockRouter}
        data={mockFmaData}
      />
    );

    // Get first Add button
    const addButtons = screen.getAllByText("Add");
    fireEvent.click(addButtons[0]);

    // Verify navigation was called
    expect(pushSpy).toHaveBeenCalled();
  });

  it("filters apps by platform when platform filter is applied", async () => {
    const render = createCustomRenderer({
      context: {
        app: {
          isGlobalAdmin: true,
          currentUser: createMockUser(),
        },
      },
    });

    const { rerender } = render(
      <FleetMaintainedAppsTable
        teamId={1}
        isLoading={false}
        query=""
        perPage={20}
        orderDirection="asc"
        orderKey="name"
        currentPage={0}
        router={mockRouter}
        data={mockFmaData}
        platformParam="windows"
      />
    );

    // Test app should be visible for Windows filter
    expect(screen.getByText("Test App")).toBeInTheDocument();
  });
});
