import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

//* ในกรณีที่เรา fetch ไปแล้วไม่เจออะไรก็ต้องเขียน error handling ดักเอาไว้เองด้วย
//* ใช้ร่วมกับ conditional rendering เอา

export const useErrorLoader = routeLoader$(async (requestEvent) => {
  const id = requestEvent.params.errorHandling;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  const data = await response.json();

  if (!data["title"]) {
    return {
      status: 301,
      message: "Bad Request",
    };
  }
  return data;
});

export default component$(() => {
  const data = useErrorLoader();

  return (
    <>
      <h3>This is error handling!</h3>
      {data.value?.title && <p>{data.value.title}</p>}
    </>
  );
});
