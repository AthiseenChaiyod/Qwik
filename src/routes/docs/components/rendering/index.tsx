import { component$ } from "@builder.io/qwik";
import {
  Binding,
  ConditionalRendering,
  ListRendering,
} from "~/components/docs/components/rendering/rendering";

export default component$(() => {
  return (
    <>
      <ListRendering />
      <ConditionalRendering />
      <Binding />
    </>
  );
});
