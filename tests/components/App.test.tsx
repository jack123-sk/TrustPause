import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/App';

describe('TrustPause User Interface & Interactions', () => {
  it('renders TrustPause brand title and hero section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /TrustPause/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Pause\. Understand\./i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the 4 primary intent options plus Not Sure', () => {
    render(<App />);
    expect(screen.getByRole('radio', { name: /Receive Money/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Send Money/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Verify Information/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Share Access/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Not Sure \/ Other/i })).toBeInTheDocument();
  });

  it('populates and analyzes Demo 2 (OTP Disclosure) on one click', () => {
    render(<App />);

    // Click Demo 2
    const demo2Button = screen.getByRole('button', { name: /Demo 2: OTP Disclosure/i });
    fireEvent.click(demo2Button);

    // Expect Critical Warning banner to appear
    expect(screen.getByText('CRITICAL WARNING')).toBeInTheDocument();
    expect(screen.getByText(/Request to Disclose OTP/i)).toBeInTheDocument();
  });

  it('clears message and resets results when Clear button is clicked', () => {
    render(<App />);

    const clearButton = screen.getByRole('button', { name: /Clear message input/i });
    fireEvent.click(clearButton);

    const textarea = screen.getByPlaceholderText(/Paste SMS, WhatsApp text/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
    expect(screen.getByText(/Ready to Analyse/i)).toBeInTheDocument();
  });
});
