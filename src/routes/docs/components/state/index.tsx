import { component$ } from "@builder.io/qwik";
import {
  State,
  Store,
  StoreWithQrl,
  UseComputedExample,
  UseResourceExample,
} from "~/components/docs/components/state/state";

export default component$(() => {
  return (
    <>
      <State />
      <Store />
      <StoreWithQrl />
      <UseComputedExample />
      <UseResourceExample />
    </>
  );
});
