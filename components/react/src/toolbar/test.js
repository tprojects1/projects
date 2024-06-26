import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toolbar from './component';

test('Toolbar renders text and triggers onClick on click', () => {
  const handleClick = jest.fn();
  render(<Toolbar text="Click Test" onClick={handleClick} />);

  const Toolbar = screen.getByRole('Toolbar', { name: /Click Test/i });
  expect(Toolbar).toBeInTheDocument();

  fireEvent.click(Toolbar);
  expect(handleClick).toHaveBeenCalledTimes(1);
});