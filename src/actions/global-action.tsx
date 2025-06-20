//* เราสามารถเขียน routeAction ในรูปแบบของ global ได้โดยการใช้ globalAction$
//* สามารถเรียกใช้ได้เหมือนกับเขียนเอาไว้ในไฟล์นั้นโดยตรง

import { globalAction$ } from "@builder.io/qwik-city";

export const useGlobalAction = globalAction$(async (formData, requestEvent) => {
  console.log("Global:", formData);

  return {
    success: true,
  };
});
