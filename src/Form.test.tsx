import { Type as T } from "@sinclair/typebox";
import { describe } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import Form from "./Form";

describe("Form", (it) => {
  it("renders", async ({ expect }) => {
    render(<Form title="test" schema={T.Object({ someCrazyName: T.String() })} />);

    const input = await screen.findByTestId("someCrazyName-input");
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: "123" } });

    fireEvent.submit(await screen.findByTestId("test"));
  });
});
