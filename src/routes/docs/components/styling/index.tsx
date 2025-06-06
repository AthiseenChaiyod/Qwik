import { component$ } from "@builder.io/qwik";
import {
  CSSModule,
  InlineCSSModule,
  UseStylesCSS,
  UseStylesCSSOnAnother,
  UseStylesScopedCSS,
  VanillaExtractCSS,
} from "~/components/docs/components/styling/styling";

export default component$(() => {
  return (
    <>
      <CSSModule />
      <UseStylesScopedCSS />
      <InlineCSSModule />
      <UseStylesCSS />
      <UseStylesCSSOnAnother />
      <VanillaExtractCSS />
    </>
  );
});
