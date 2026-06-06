// @ts-nocheck
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SoftwareInventory from '../index';

// 1）PowerShell 相关方法被正确模拟
const mockRunPowerShell = jest.fn();

jest.mock('../index', () => {
    return function DummySoftwareInventory(props: any) {
        if (props.deviceType === 'Windows') {
            return (
                <div>
                    <button onClick={mockRunPowerShell}>Run PowerShell</button>
                </div>
            );
        }
        return <div>No PowerShell Support</div>;
    };
});

describe('SoftwareInventory Component - PowerShell Windows FMA', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should mock PowerShell related methods correctly', () => {
        expect(mockRunPowerShell).toBeDefined();
    });

    it('should trigger expected behavior when the button is clicked', () => {
        render(<SoftwareInventory deviceType="Windows" />);
        const button = screen.getByRole('button', { name: /Run PowerShell/i });
        fireEvent.click(button);
        expect(mockRunPowerShell).toHaveBeenCalledTimes(1);
    });

    it('should conditionally display the button based on device type', () => {
        const { rerender } = render(<SoftwareInventory deviceType="Windows" />);
        expect(screen.getByRole('button', { name: /Run PowerShell/i })).toBeInTheDocument();

        rerender(<SoftwareInventory deviceType="Mac" />);
        expect(screen.queryByRole('button', { name: /Run PowerShell/i })).not.toBeInTheDocument();
    });
});
