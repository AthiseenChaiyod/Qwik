import { component$ } from "@builder.io/qwik";

//* component นี้จะถูก render ตรงตำแหน่งของ slot ใน layout.tsx

export default component$(() => {
  return (
    <>
      <h3>This is not layout! (a child)</h3>
    </>
  );
});
