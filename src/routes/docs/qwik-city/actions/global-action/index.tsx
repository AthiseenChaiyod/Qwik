import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import { useGlobalAction } from "~/actions/global-action";

//* อ่านที่ actions/global-action.tsx

export default component$(() => {
  const action = useGlobalAction();

  return (
    <>
      <Form action={action}>
        <input type="text" name="firstName" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Actions [Global Action]",
  };
};
