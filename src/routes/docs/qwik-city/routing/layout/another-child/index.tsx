import { component$ } from "@builder.io/qwik";

//* layout จะถูก render อยู่ที่เดิม แม้ว่าเราจะมี nested route ก็ตาม

export default component$(() => {
  return (
    <>
      <h3>Another child!</h3>
    </>
  );
});
