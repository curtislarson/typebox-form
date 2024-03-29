import { TypeBoxForm } from "../src";
import { Type as T } from "@sinclair/typebox";
import { render } from "preact";

import "./main.css";

const ExampleSchema = T.Object({
  name: T.String(),
  location: T.Object({
    city: T.String(),
    state: T.String(),
  }),
  email: T.String({ format: "email" }),
  website: T.String({ format: "uri" }),
  password: T.String({ format: "password" }),
  date: T.Date(),
  dateString: T.String({ format: "date" }),
  selectValue: T.Enum({ foo: "bar", baz: "bing" }),
  confirm: T.Boolean(),
});

function Example() {
  return (
    <div>
      <main class="relative mt-5 w-full bg-white px-6 py-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:pb-28 lg:pt-16">
        <div>
          <TypeBoxForm title="Example Form" schema={ExampleSchema} onFormSubmit={(data) => console.log(data)} />
        </div>
      </main>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<Example />, document.getElementById("example")!);
