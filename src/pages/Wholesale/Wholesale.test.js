import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import Wholesale from "./Wholesale";
import { supabase } from "../../supabase";

// Mock Supabase client
jest.mock("../../supabase", () => {
  const mockInsert = jest.fn();
  
  const mockSupabase = {
    from: () => mockSupabase,
    insert: mockInsert,
    select: () => Promise.resolve({ data: [], error: null })
  };

  return {
    __esModule: true,
    supabase: mockSupabase,
    default: mockSupabase,
    isSupabaseConfigured: true
  };
});

describe("Wholesale Page Concurrency and Form Hardening", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const fillForm = (data) => {
    fireEvent.change(screen.getByLabelText(/Contact Name \*/i), {
      target: { value: data.name }
    });
    fireEvent.change(screen.getByLabelText(/Business \/ Restaurant Name \*/i), {
      target: { value: data.businessName }
    });
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), {
      target: { value: data.email }
    });
    if (data.phone) {
      fireEvent.change(screen.getByLabelText(/Contact Number/i), {
        target: { value: data.phone }
      });
    }
    if (data.message) {
      fireEvent.change(screen.getByLabelText(/Message \/ Sourcing/i), {
        target: { value: data.message }
      });
    }
  };

  test("Empty form submission blocks insert call and sets validation errors", async () => {
    render(
      <BrowserRouter>
        <Wholesale />
      </BrowserRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /Submit Partnership Inquiry/i });
    fireEvent.click(submitBtn);

    expect(supabase.insert).not.toHaveBeenCalled();
    expect(screen.getByText("Contact Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Business / Restaurant Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email Address is required.")).toBeInTheDocument();
  });

  test("Synchronous submission lock prevents duplicate calls during double-click or rapid clicks", async () => {
    let resolvePromise;
    const slowPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Mock insert to wait for our trigger
    supabase.insert.mockImplementationOnce(() => slowPromise);

    render(
      <BrowserRouter>
        <Wholesale />
      </BrowserRouter>
    );

    fillForm({
      name: "Chef Sanjay Kapoor",
      businessName: "The Truffle Table",
      email: "chef@restaurant.com",
      phone: "+91 92389 09365"
    });

    const submitBtn = screen.getByRole("button", { name: /Submit Partnership Inquiry/i });

    // Click multiple times rapidly
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Let the mock request finish
    resolvePromise({ error: null });

    await waitFor(() => {
      expect(screen.getByText(/Inquiry Submitted Successfully!/i)).toBeInTheDocument();
    });

    // Supabase insert should only be called EXACTLY once
    expect(supabase.insert).toHaveBeenCalledTimes(1);
  });

  test("Failed request retry works and does not clear draft inputs on error", async () => {
    // 1st call fails
    supabase.insert.mockResolvedValueOnce({ error: new Error("DB Error") });
    // 2nd call succeeds
    supabase.insert.mockResolvedValueOnce({ error: null });

    render(
      <BrowserRouter>
        <Wholesale />
      </BrowserRouter>
    );

    fillForm({
      name: "Chef Sanjay Kapoor",
      businessName: "The Truffle Table",
      email: "chef@restaurant.com"
    });

    const submitBtn = screen.getByRole("button", { name: /Submit Partnership Inquiry/i });

    // Submit 1 (fails)
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const errorBanners = screen.getAllByText(/Unable to submit inquiry/i);
      expect(errorBanners.length).toBeGreaterThan(0);
    });

    // Form inputs should still be preserved
    expect(screen.getByLabelText(/Contact Name \*/i).value).toBe("Chef Sanjay Kapoor");

    // Submit 2 (succeeds)
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Inquiry Submitted Successfully!/i)).toBeInTheDocument();
    });

    expect(supabase.insert).toHaveBeenCalledTimes(2);
  });

  test("Submit Another Inquiry button resets all form state cleanly", async () => {
    supabase.insert.mockResolvedValueOnce({ error: null });

    render(
      <BrowserRouter>
        <Wholesale />
      </BrowserRouter>
    );

    fillForm({
      name: "Chef Sanjay",
      businessName: "Truffle Table",
      email: "chef@truffle.com",
      phone: "123456",
      message: "Need 10kg Lions Mane weekly."
    });

    const submitBtn = screen.getByRole("button", { name: /Submit Partnership Inquiry/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Inquiry Submitted Successfully!/i)).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole("button", { name: /Submit Another Inquiry/i });
    fireEvent.click(resetBtn);

    // All form fields should be empty/default
    expect(screen.getByLabelText(/Contact Name \*/i).value).toBe("");
    expect(screen.getByLabelText(/Business \/ Restaurant Name \*/i).value).toBe("");
    expect(screen.getByLabelText(/Email Address \*/i).value).toBe("");
    expect(screen.getByLabelText(/Contact Number/i).value).toBe("");
    expect(screen.getByLabelText(/Message \/ Sourcing/i).value).toBe("");
  });
});
