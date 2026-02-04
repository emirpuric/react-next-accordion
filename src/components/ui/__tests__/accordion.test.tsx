import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

function renderSingleAccordion(defaultValue?: string) {
  return render(
    <Accordion type="single" defaultValue={defaultValue}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Trigger 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Trigger 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Trigger 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

function renderMultipleAccordion(defaultValue?: string[]) {
  return render(
    <Accordion type="multiple" defaultValue={defaultValue}>
      <AccordionItem value="a">
        <AccordionTrigger>Trigger A</AccordionTrigger>
        <AccordionContent>Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Trigger B</AccordionTrigger>
        <AccordionContent>Content B</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Accordion", () => {
  it("renders all triggers", () => {
    renderSingleAccordion();
    expect(screen.getByText("Trigger 1")).toBeInTheDocument();
    expect(screen.getByText("Trigger 2")).toBeInTheDocument();
    expect(screen.getByText("Trigger 3")).toBeInTheDocument();
  });

  it("renders all content sections", () => {
    renderSingleAccordion();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.getByText("Content 3")).toBeInTheDocument();
  });

  it("applies className to the root wrapper", () => {
    const { container } = render(
      <Accordion className="custom-class">
        <AccordionItem value="x">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies className to AccordionItem", () => {
    render(
      <Accordion>
        <AccordionItem value="x" className="item-class">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("T").closest("div")).toHaveClass("item-class");
  });
});

// ---------------------------------------------------------------------------
// Single mode
// ---------------------------------------------------------------------------

describe("Accordion type=single", () => {
  it("starts with all items closed when no defaultValue", () => {
    renderSingleAccordion();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("opens the defaultValue item on mount", () => {
    renderSingleAccordion("item-2");
    expect(screen.getByText("Trigger 1")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Trigger 2")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Trigger 3")).toHaveAttribute("aria-expanded", "false");
  });

  it("opens an item when its trigger is clicked", async () => {
    const user = userEvent.setup();
    renderSingleAccordion();

    await user.click(screen.getByText("Trigger 1"));
    expect(screen.getByText("Trigger 1")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the open item when another is clicked", async () => {
    const user = userEvent.setup();
    renderSingleAccordion("item-1");

    await user.click(screen.getByText("Trigger 2"));
    expect(screen.getByText("Trigger 1")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Trigger 2")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes an item when clicked again (toggle off)", async () => {
    const user = userEvent.setup();
    renderSingleAccordion("item-1");

    await user.click(screen.getByText("Trigger 1"));
    expect(screen.getByText("Trigger 1")).toHaveAttribute("aria-expanded", "false");
  });

  it("only allows one item open at a time", async () => {
    const user = userEvent.setup();
    renderSingleAccordion();

    await user.click(screen.getByText("Trigger 1"));
    await user.click(screen.getByText("Trigger 3"));

    expect(screen.getByText("Trigger 1")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Trigger 2")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Trigger 3")).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// Multiple mode
// ---------------------------------------------------------------------------

describe("Accordion type=multiple", () => {
  it("opens the defaultValue items on mount", () => {
    renderMultipleAccordion(["a", "b"]);
    expect(screen.getByText("Trigger A")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Trigger B")).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple items to be open simultaneously", async () => {
    const user = userEvent.setup();
    renderMultipleAccordion();

    await user.click(screen.getByText("Trigger A"));
    await user.click(screen.getByText("Trigger B"));

    expect(screen.getByText("Trigger A")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Trigger B")).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles individual items without affecting others", async () => {
    const user = userEvent.setup();
    renderMultipleAccordion(["a", "b"]);

    await user.click(screen.getByText("Trigger A"));

    expect(screen.getByText("Trigger A")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Trigger B")).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// Accessibility (ARIA)
// ---------------------------------------------------------------------------

describe("Accordion accessibility", () => {
  it("triggers are buttons with type=button", () => {
    renderSingleAccordion();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("type", "button");
    });
  });

  it("triggers have aria-controls pointing to their content region", () => {
    renderSingleAccordion();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      const controlsId = btn.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      const region = document.getElementById(controlsId!);
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("role", "region");
    });
  });

  it("content regions have aria-labelledby pointing back to their trigger", () => {
    renderSingleAccordion();
    const regions = screen.getAllByRole("region");
    regions.forEach((region) => {
      const labelledBy = region.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      const trigger = document.getElementById(labelledBy!);
      expect(trigger).toBeInTheDocument();
      expect(trigger!.tagName).toBe("BUTTON");
    });
  });

  it("content has data-state=open when expanded and data-state=closed when collapsed", async () => {
    const user = userEvent.setup();
    renderSingleAccordion();

    const trigger = screen.getByText("Trigger 1");
    const contentId = trigger.getAttribute("aria-controls")!;
    const content = document.getElementById(contentId)!;

    expect(content).toHaveAttribute("data-state", "closed");

    await user.click(trigger);
    expect(content).toHaveAttribute("data-state", "open");

    await user.click(trigger);
    expect(content).toHaveAttribute("data-state", "closed");
  });

  it("chevron icon is hidden from assistive technology", () => {
    renderSingleAccordion();
    const svgs = document.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});

// ---------------------------------------------------------------------------
// Animation CSS class
// ---------------------------------------------------------------------------

describe("Accordion animation", () => {
  it("content wrapper has accordion-grid class", () => {
    renderSingleAccordion();
    const regions = screen.getAllByRole("region");
    regions.forEach((region) => {
      expect(region).toHaveClass("accordion-grid");
    });
  });
});

// ---------------------------------------------------------------------------
// Error boundaries
// ---------------------------------------------------------------------------

describe("Accordion error handling", () => {
  it("throws if AccordionItem is used outside Accordion", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <AccordionItem value="orphan">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>,
      ),
    ).toThrow("Accordion compound components must be used within <Accordion>");
    spy.mockRestore();
  });

  it("throws if AccordionTrigger is used outside AccordionItem", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Accordion>
          <AccordionTrigger>T</AccordionTrigger>
        </Accordion>,
      ),
    ).toThrow("AccordionItem compound components must be used within <AccordionItem>");
    spy.mockRestore();
  });

  it("throws if AccordionContent is used outside AccordionItem", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Accordion>
          <AccordionContent>C</AccordionContent>
        </Accordion>,
      ),
    ).toThrow("AccordionItem compound components must be used within <AccordionItem>");
    spy.mockRestore();
  });
});
