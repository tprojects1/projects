import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './component';

test('Button renders text and triggers onClick on click', () => {
  const handleClick = jest.fn();
  render(<Button text="Click Test" onClick={handleClick} />);

  const button = screen.getByRole('button', { name: /Click Test/i });
  expect(button).toBeInTheDocument();

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});