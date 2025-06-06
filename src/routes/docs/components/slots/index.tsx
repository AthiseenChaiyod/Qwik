import { component$ } from "@builder.io/qwik";
import {
  NamedSlotUsage,
  SlotsUsage,
  UnprojectedSlotUsage,
} from "~/components/docs/components/slots/slots";

export default component$(() => {
  return (
    <>
      <SlotsUsage />
      <NamedSlotUsage />
      <UnprojectedSlotUsage />
    </>
  );
});
