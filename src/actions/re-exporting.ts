import { routeLoader$ } from "@builder.io/qwik-city";

export const useReExporting = routeLoader$((requestEvent) => {
  return "This must be re-exporting in .tsx file!";
});
