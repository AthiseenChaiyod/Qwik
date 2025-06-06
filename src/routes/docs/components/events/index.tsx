import { $, component$ } from "@builder.io/qwik";
import {
  BindValue,
  CurrentTarget,
  CustomEvent,
  EventObject,
  Events,
  MultipleEvents,
  PreventDefault,
  ReusingEvents,
  StopPropagation,
  SyncEvent,
  UseOnDocument,
  UseOnWindow,
} from "~/components/docs/components/events/events";

export default component$(() => {
  return (
    <>
      <Events />
      <BindValue />
      <ReusingEvents />
      <MultipleEvents />
      <EventObject />
      <PreventDefault />
      <StopPropagation />
      <CurrentTarget />
      <SyncEvent />
      <CustomEvent customClick$={() => console.log("Custom event logged!")} />
      <UseOnDocument />
      <UseOnWindow />
    </>
  );
});
