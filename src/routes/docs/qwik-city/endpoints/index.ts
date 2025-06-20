import type { RequestHandler } from "@builder.io/qwik-city";

//* ที่จริงแล้วนอกจาก endpoints แล้วเราก็มี server$ ที่จะเจอต่อในอนาคต
//* server$ จะทำหน้าที่ backend จริง ๆ จัง ๆ ใน app ได้ดีกว่า
//* endpoints จะเหมาะสำหรับทำ response ส่งข้อมูลให้กับ external อย่าง mobile app / third party services

export const onGet: RequestHandler = async (requestEvent) => {
  requestEvent.json(200, {
    message: "This is GET request!",
  });
};

export const onPost: RequestHandler = async (requestEvent) => {
  requestEvent.json(201, {
    message: "This is POST request!",

    data: await requestEvent.parseBody(),
  });
};
