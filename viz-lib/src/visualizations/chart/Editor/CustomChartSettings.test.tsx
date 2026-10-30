import React from "react";
import enzyme from "enzyme";

import getOptions from "../getOptions";
import CustomChartSettings from "./CustomChartSettings";

jest.mock("@monaco-editor/react", () => {
  return function MockEditor(props: any) {
    return (
      <>
        <textarea
          data-test="Chart.Custom.Editor"
          data-height={props.height}
          value={props.value}
          onChange={event => props.onChange(event.target.value)}
        />

        <button
          type="button"
          data-test="Chart.Custom.Validate"
          onClick={() =>
            props.onValidate([
              {
                startLineNumber: 3,
                message: "Unexpected token",
              },
            ])
          }
        >
          Validate
        </button>
      </>
    );
  };
});

function findByTestID(wrapper: any, testId: any) {
  return wrapper.find(`[data-test="${testId}"]`);
}

function mount(options: any, onOptionsChange: any = jest.fn()) {
  options = getOptions(options);

  return enzyme.mount(
    <CustomChartSettings
      options={options}
      data={{ columns: [], rows: [] }}
      onOptionsChange={onOptionsChange}
    />
  );
}

describe("Visualizations -> Chart -> Editor -> Custom Chart Settings", () => {
  test("Renders custom code editor", () => {
    const el = mount({});

    expect(findByTestID(el, "Chart.Custom.Editor").exists()).toBe(true);
  });

  test("Displays default custom code", () => {
    const el = mount({});

    expect(findByTestID(el, "Chart.Custom.Editor").prop("value")).toContain(
      "Available variables are x, ys, element, and Plotly"
    );
  });

  test("Displays existing custom code", () => {
    const customCode = "console.log(x, ys);";
    const el = mount({ customCode });

    expect(findByTestID(el, "Chart.Custom.Editor").prop("value")).toBe(
      customCode
    );
  });

  test("Changes custom code", () => {
    const onOptionsChange = jest.fn();
    const el = mount({}, onOptionsChange);

    findByTestID(el, "Chart.Custom.Editor").simulate("change", {
      target: { value: "console.log('test');" },
    });

    expect(onOptionsChange).toHaveBeenCalledWith({
      customCode: "console.log('test');",
    });
  });

  test("Expands and minimizes editor", () => {
    const el = mount({});

    const editor = () => findByTestID(el, "Chart.Custom.Editor");
    const expandButton = () => el.find("button").filterWhere(
        button => ["Expand", "Minimize"].includes(button.text())
    );
    expect(expandButton().text()).toBe("Expand");
    expect(editor().prop("data-height")).toBe("300px");

    expandButton().simulate("click");

    expect(editor().prop("data-height")).toBe("80vh");
    expect(expandButton().text()).toBe("Minimize");

    expandButton().simulate("click");

    expect(editor().prop("data-height")).toBe("300px");
  });

  test("Displays validation errors", () => {
    const el = mount({});

    findByTestID(el, "Chart.Custom.Validate").simulate("click");

    expect(el.text()).toContain("Problems (1)");
    expect(el.text()).toContain("Line 3: Unexpected token");
  });
});