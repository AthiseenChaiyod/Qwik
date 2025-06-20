import { component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

//* ส่วนใน server$ เราจะต้องทำ .then / .catch ของ async error handling เอาเอง

export const serverErrorHandling = server$(async function () {
  const result = await fetch("http://localhost:5173/docs/qwik-city/endpoints");

  return result.json();
});

export default component$(() => {
  const data = serverErrorHandling();

  data
    .then((resolve) => console.log("Resolve:", resolve))
    .catch((reject) => console.log("Reject:", reject.message));

  return (
    <>
      <h3>This is Error Handling [server$]</h3>
    </>
  );
});
