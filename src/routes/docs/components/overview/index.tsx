import { component$ } from "@builder.io/qwik";
import {
  Overview,
  OverviewUsage,
  SignalExample,
  ComponentProps,
  AlternativeProps,
  DestructuringProps,
  DefaultProps,
  ElementAccess,
  ElementAccessByDomApi,
} from "~/components/docs/components/overview/overview";

export default component$(() => {
  return (
    <>
      <Overview />
      <OverviewUsage />
      <SignalExample />

      <ComponentProps
        title="Componet Props!"
        description="This is from Component Props!"
      />
      <AlternativeProps
        title="Alternative Props!"
        description="This is from Alternative Props!"
      />
      <DestructuringProps
        title="Destructuring Props!"
        description="This is from Destructuring Props!"
      />
      <DefaultProps description="Hola!" />

      <ElementAccess />
      <ElementAccessByDomApi />
    </>
  );
});
