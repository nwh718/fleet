import React from "react";
import { screen } from "@testing-library/react";
import { createCustomRenderer, createMockRouter } from "test/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import createMockUser from "__mocks__/userMock";
import {
    createMockSoftwareTitlesResponse,
    createMockSoftwareVersionsResponse,
    createMockFleetMaintainedApp,
} from "__mocks__/softwareMock";
import { noop } from "lodash";

import softwareAPI from "services/entities/software";
import SoftwareInventory from "./SoftwareInventory";

jest.mock("services/entities/software", () => ({
    __esModule: true,
    default: {
        getSoftwareTitles: jest.fn(),
        getSoftwareVersions: jest.fn(),
    },
}));

const mockRouter = createMockRouter();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe("SoftwareInventory", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls getSoftwareTitles for software titles view", async () => {
        (softwareAPI.getSoftwareTitles as jest.Mock).mockResolvedValue(
            createMockSoftwareTitlesResponse()
        );

        const render = createCustomRenderer({
            context: {
                app: {
                    isGlobalAdmin: true,
                    currentUser: createMockUser(),
                },
            },
        });

        const originalPath = window.location.pathname;
        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: "/software/inventory",
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <SoftwareInventory
                    router={mockRouter}
                    isSoftwareEnabled
                    query=""
                    perPage={50}
                    orderDirection="desc"
                    orderKey="hosts_count"
                    vulnFilters={{
                        vulnerable: false,
                        exploit: false,
                        minCvssScore: undefined,
                        maxCvssScore: undefined,
                    }}
                    currentPage={0}
                    teamId={1}
                    onAddFiltersClick={noop}
                />
            </QueryClientProvider>
        );

        expect(softwareAPI.getSoftwareTitles).toHaveBeenCalled();

        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: originalPath,
            },
        });
    });

    it("calls getSoftwareVersions for software versions view", async () => {
        (softwareAPI.getSoftwareVersions as jest.Mock).mockResolvedValue(
            createMockSoftwareVersionsResponse()
        );

        const render = createCustomRenderer({
            context: {
                app: {
                    isGlobalAdmin: true,
                    currentUser: createMockUser(),
                },
            },
        });

        const originalPath = window.location.pathname;
        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: "/software/versions",
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <SoftwareInventory
                    router={mockRouter}
                    isSoftwareEnabled
                    query=""
                    perPage={50}
                    orderDirection="desc"
                    orderKey="hosts_count"
                    vulnFilters={{
                        vulnerable: false,
                        exploit: false,
                        minCvssScore: undefined,
                        maxCvssScore: undefined,
                    }}
                    currentPage={0}
                    teamId={1}
                    onAddFiltersClick={noop}
                />
            </QueryClientProvider>
        );

        expect(softwareAPI.getSoftwareVersions).toHaveBeenCalled();

        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: originalPath,
            },
        });
    });

    it("renders SoftwareInventoryTable when data is loaded", async () => {
        (softwareAPI.getSoftwareTitles as jest.Mock).mockResolvedValue(
            createMockSoftwareTitlesResponse()
        );

        const render = createCustomRenderer({
            context: {
                app: {
                    isGlobalAdmin: true,
                    currentUser: createMockUser(),
                },
            },
        });

        const originalPath = window.location.pathname;
        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: "/software/inventory",
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <SoftwareInventory
                    router={mockRouter}
                    isSoftwareEnabled
                    query=""
                    perPage={50}
                    orderDirection="desc"
                    orderKey="hosts_count"
                    vulnFilters={{
                        vulnerable: false,
                        exploit: false,
                        minCvssScore: undefined,
                        maxCvssScore: undefined,
                    }}
                    currentPage={0}
                    teamId={1}
                    onAddFiltersClick={noop}
                />
            </QueryClientProvider>
        );

        // Wait for data to load
        await screen.findByPlaceholderText("Search by name or vulnerability (CVE)");

        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                ...window.location,
                pathname: originalPath,
            },
        });
    });
});
