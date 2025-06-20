import { component$ } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

//* argument ตัวที่สองของ cacheControl จะเป็น pattern ที่ใช้สำหรับ cacheControl
//* เช่น 'CDN-Cache-Control', 'Cloudflare-CDN-Cache-Control', etc.
//* เอาไว้ใช้สำหรับการทำ cache บน context นั้น ๆ เนื่องจากแต่ละที่จัดการ cache ต่างกัน (ควรใส่ให้ตรง)

export const onRequest: RequestHandler = async (requestEvent) => {
  requestEvent.cacheControl(
    {
      public: false,
      sMaxAge: 0,
      maxAge: 5,
      staleWhileRevalidate: 10,
    },
    "CDN-Cache-Control"
  );
};

export default component$(() => {
  return (
    <>
      <h3>This is Caching [CDN Cache Control]</h3>
    </>
  );
});
