import { isNil, trimStart } from "lodash";
import React, { useState } from "react";

import Editor from "@monaco-editor/react";

import { Section, Switch } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

const defaultCustomCode = trimStart(`
// Available variables are x, ys, element, and Plotly
// Type console.log(x, ys); for more info about x and ys
// To plot your graph call Plotly.plot(element, ...)
// Plotly examples and docs: https://plot.ly/javascript/
`);

export default function CustomChartSettings({ options, onOptionsChange }: any) {
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);

  return (
    <React.Fragment>
      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
       <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Custom code</span>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Minimize" : "Expand"}
          </button>
        </div>

        <Editor
          height={expanded ? "80vh" : "300px"}
          defaultLanguage="javascript"
          theme="vs-dark"
          value={isNil(options.customCode) ? defaultCustomCode : options.customCode}
          onChange={(value) => onOptionsChange({ customCode: value ?? "" })}
          onValidate={(markers) => setErrors(markers)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            folding: true,
            scrollbar: {
              alwaysConsumeMouseWheel: true,
            },
          }}
        />

        <div style={{ marginTop: 8 }}>
          <strong>Problems ({errors.length})</strong>

          {errors.map((error, index) => (
            <div key={index} style={{ color: "red", fontSize: 12 }}>
              Line {error.startLineNumber}: {error.message}
            </div>
          ))}
        </div>
      </div>
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
        <Switch
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
          data-test="Chart.Custom.EnableConsoleLogs"
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
          defaultChecked={options.enableConsoleLogs}
          // @ts-expect-error ts-migrate(2322) FIXME: Type '(enableConsoleLogs: any) => any' is not assi... Remove this comment to see the full error message
          onChange={(enableConsoleLogs: any) => onOptionsChange({ enableConsoleLogs })}>
          Show errors in the console
        </Switch>
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
        <Switch
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
          id="chart-editor-auto-update-custom-chart"
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
          data-test="Chart.Custom.AutoUpdate"
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
          defaultChecked={options.autoRedraw}
          // @ts-expect-error ts-migrate(2322) FIXME: Type '(autoRedraw: any) => any' is not assignable ... Remove this comment to see the full error message
          onChange={(autoRedraw: any) => onOptionsChange({ autoRedraw })}>
          Auto update graph
        </Switch>
      </Section>
    </React.Fragment>
  );
}

CustomChartSettings.propTypes = EditorPropTypes;
