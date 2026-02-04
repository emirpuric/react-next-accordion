import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

describe("Home page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  // -------------------------------------------------------------------------
  // Page structure
  // -------------------------------------------------------------------------

  it("renders the main heading", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: "Accordion Component" }),
    ).toBeInTheDocument();
  });

  it("renders the FAQ section heading", () => {
    expect(screen.getByRole("heading", { level: 2, name: /FAQ/ })).toBeInTheDocument();
  });

  it("renders the How It Works section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: /How It Works/ }),
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // FAQ accordion (single mode)
  // -------------------------------------------------------------------------

  it("renders all four FAQ questions", () => {
    expect(screen.getByText("What is Next.js?")).toBeInTheDocument();
    expect(screen.getByText("Why use TypeScript with React?")).toBeInTheDocument();
    expect(screen.getByText("What is Tailwind CSS?")).toBeInTheDocument();
    expect(screen.getByText("What is the App Router?")).toBeInTheDocument();
  });

  it("has 'What is Next.js?' open by default", () => {
    const trigger = screen.getByText("What is Next.js?");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps other FAQ items closed by default", () => {
    expect(screen.getByText("Why use TypeScript with React?")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("What is Tailwind CSS?")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("What is the App Router?")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("switches open FAQ item when another is clicked (single mode)", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByText("What is Tailwind CSS?"));

    expect(screen.getByText("What is Next.js?")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("What is Tailwind CSS?")).toHaveAttribute("aria-expanded", "true");
  });

  // -------------------------------------------------------------------------
  // How It Works accordion (multiple mode)
  // -------------------------------------------------------------------------

  it("renders all three feature items", () => {
    expect(screen.getByText("Compound Component Pattern")).toBeInTheDocument();
    expect(screen.getByText("Fully Accessible")).toBeInTheDocument();
    expect(screen.getByText("Smooth CSS Animation")).toBeInTheDocument();
  });

  it("starts with all feature items closed", () => {
    expect(screen.getByText("Compound Component Pattern")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Fully Accessible")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Smooth CSS Animation")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("allows multiple feature items to be open at the same time", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByText("Compound Component Pattern"));
    await user.click(screen.getByText("Smooth CSS Animation"));

    expect(screen.getByText("Compound Component Pattern")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Smooth CSS Animation")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  // -------------------------------------------------------------------------
  // Content text
  // -------------------------------------------------------------------------

  it("renders FAQ answer content", () => {
    expect(
      screen.getByText(/React framework that enables server-side rendering/),
    ).toBeInTheDocument();
  });

  it("renders feature description content", () => {
    expect(
      screen.getByText(/compound component pattern.*React Context/i),
    ).toBeInTheDocument();
  });
});
