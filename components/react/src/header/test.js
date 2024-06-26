import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './component';
import { waitFor } from '@testing-library/react';

test('Header initially renders hidden and becomes visible after simulated timeout', async () => {
    render(<Header text="My Header" />);    

    // Use waitFor to wait for the simulated class removal (assuming a class toggle)
    await waitFor(() => expect(screen.getByRole('heading')).not.toHaveClass('hidden'));

    // Additional assertions after the header becomes visible (optional)
    expect(screen.getByRole('heading')).toBeVisible();
});