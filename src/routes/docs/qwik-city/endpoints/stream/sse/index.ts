import type { RequestHandler } from "@builder.io/qwik-city";

//* จากเรื่อง buffer ที่เราจะไม่สามารถส่งข้อมูลแบบ streaming ได้ถ้าไม่ flush buffer ก่อน
//* อย่างไรก็ตาม การ flush มันก็มี overhead อีกทั้งเรายังสามารถตั้งค่าให้ส่งค่า streaming กลับได้เลยโดยไม่ต้องใช้ flush buffer
//* ให้เราตั้งค่า headers Content-Type เป็น "text/event-stream"
//* เท่านี้เราก็ไม่ต้องทำ flush buffer แล้ว
//* แนะนำให้ตั้ง Cache-Control เป็น "no-cache" เพื่อป้องกันการ cache ข้อมูลด้วย เนื่องจากเราต้องส่งข้อมูลเยอะ
//* และ "Connection" เป็น "keep-alive" เพื่อป้องกันการปิด connection ก่อนที่จะส่งข้อมูลเสร็จ
//* เหมือนเดิม ถ้าเกิดเป็น type อื่นนอกจาก string ก็ให้แปลง type เป็น string ด้วย

export const onGet: RequestHandler = async (requestEvent) => {
  requestEvent.headers.set("Content-Type", "text/event-stream");
  requestEvent.headers.set("Cache-Control", "no-cache");
  requestEvent.headers.set("Connection", "keep-alive");

  const writableStream = requestEvent.getWritableStream();
  const writer = writableStream.getWriter();
  const encoder = new TextEncoder();

  const wait = (ms: number) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  };
  const write = (data: string) => {
    return writer.write(encoder.encode(data));
  };

  try {
    write("This is endpoints but SSE!\n");
    await wait(2000);
    await writer.ready;

    write("Streaming data!\n");
    await wait(2000);
    await writer.ready;

    write("Streaming end!\n");
  } catch (error) {
    console.error(error);
  } finally {
    writer.close();
  }
};
