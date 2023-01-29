import { TypeBoxForm } from "../src";
import { Type as T } from "@sinclair/typebox";
import { render } from "preact";

import "./main.css";

const ExampleSchema = T.Object({
  name: T.String(),
  age: T.Number(),
  location: T.Object({
    city: T.String(),
    state: T.String(),
  }),
  email: T.String({ format: "email" }),
  website: T.String({ format: "uri" }),
  confirm: T.Boolean(),
});

function Example() {
  return (
    <main class="relative mt-5 w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28">
      <div>
        <TypeBoxForm title="Example Form" schema={ExampleSchema} onFormSubmit={(data) => console.log(data)} />
      </div>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<Example />, document.getElementById("example")!);
