import type { RequestHandler } from "@builder.io/qwik-city";

//* concept ของ reverse proxy ก็คือการใช้ backend เพื่อ fetch ต่อ
//* อาจจะต้องการปิด ip ของ frontend ที่ใช้หรือเพื่อป้องกัน cors เวลาส่ง front -> back ก็แล้วแต่
//* บางครั้งเราก็ไม่อยากจะพิมพ์ path เต็ม ๆ ตลอดเวลา เราสามารถใช้ relative path ได้เหมือนกัน
//* แต่การใช้ relative path จะมาพร้อมกับ new URL() เสมอ
//* new URL จะสร้าง string url ใหม่ให้เราโดยใช้ argument 2 ตัว
//* ตัวแรกคือ string relative path ที่เราต้องการ เช่น '../something'
//* ตัวที่สองคือ string base path ที่เราที่จะเข้าถึงด้วย argument ตัวแรก
//* สมมติว่า const newUrl = new URL('../something', 'https://example.com/docs')
//* เราก็จะได้ newUrl = 'https://example.com/something' แทน

export const onGet: RequestHandler = async (requestEvent) => {
  console.log(requestEvent.url);

  const response = await fetch(new URL("../endpoints", requestEvent.url));

  requestEvent.send(response.status, await response.text());
};
