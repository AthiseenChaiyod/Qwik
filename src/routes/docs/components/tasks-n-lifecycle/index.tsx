import { component$ } from "@builder.io/qwik";
import {
  Eagerness,
  UseTask,
  UseVisibleTask,
} from "~/components/docs/components/tasks-n-lifecycle/tasks-n-lifecycle";

export default component$(() => {
  return (
    <>
      <UseTask />
      <UseVisibleTask />
      <Eagerness />
    </>
  );
});
