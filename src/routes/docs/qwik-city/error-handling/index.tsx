import { component$, isBrowser } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import { ServerError } from "@builder.io/qwik-city/middleware/request-handler";

//* เราสามารถจัดการกับ error handling ได้โดยใช้ throw new ServerError หรือ requestEvent.error ก็ได้
//* ทั้ง 2 วิธีจะต้องส่ง argument 2 ตัวเหมือนกัน นั่นก็คือ status: number และ data: string

export const onRequest: RequestHandler = async (requestEvent) => {
  if (isBrowser) {
    throw new ServerError(500, "This should not be running on Client");
  }

  if (!isLoggedIn()) {
    throw requestEvent.error(401, "Unauthorized");
  }
};

function isLoggedIn() {
  return true;
}

export default component$(() => {
  return (
    <>
      <h3>This is Error Handling</h3>
    </>
  );
});
