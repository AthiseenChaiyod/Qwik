import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeAction$ } from "@builder.io/qwik-city";

//* ในการจัดการกับ input ประเภท files เราสามารถส่งมาง่าย ๆ ด้วย <Form action={} /> ก็ได้
//* แต่ถ้าเราต้องการประมวลผลบางอย่างก่อน submit ก็ให้เราใช้ action.submit เอาง่ายกว่า
//* จะต้องใช้ ref เพื่อเข้าถึง input element และดึงค่าของ files?.[0] ออกมา
//* ตอนจะส่ง files?.[0] ด้วย action.submit() ก็ค่อยใช้ new FormData() และ append เข้าไปเอา
//* เช่น const formData = new FormData(); formData.append("file", file); await action.submit(formData);
//* ตอนจะเข้าถึง file รูปที่เรา submit เข้าไปก็แค่ใช้ชื่อเดียวกับ key ที่เราผูกเอาไว้กับ file ตอน append

export const useFileSubmit = routeAction$(async (formData, requestEvent) => {
  console.log(formData.moomoo);

  return {
    success: true,
  };
});

export default component$(() => {
  const action = useFileSubmit();
  const inputRef = useSignal<HTMLInputElement | undefined>(undefined);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onInput$={(inputEvent, htmlElement) => {
          const file = htmlElement.files?.[0];

          if (file) {
            console.log(file.size);
          } else {
            console.log("No file selected");
          }
        }}
      />

      <button
        onClick$={async () => {
          if (inputRef.value) {
            const file = inputRef.value.files?.[0];
            console.log(file);

            if (file) {
              const formData = new FormData();
              formData.append("moomoo", file);
              console.log(formData);

              const isSuccess = await action.submit(formData);
              console.log("value:", isSuccess);
            } else {
              console.log("No file selected");
            }
          }
        }}
      >
        Upload
      </button>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Actions [Uploading Files]",
  };
};
