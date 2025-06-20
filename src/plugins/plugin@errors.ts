import { isDev } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import {
  RedirectMessage,
  ServerError,
} from "@builder.io/qwik-city/middleware/request-handler";

//* อย่างสุดท้ายคือการเขียน error handling เอาไว้เป็น plugin (ทำงานทั้ง application)
//* โดยก่อนที่เราจะเขียน เราต้องไปประกาศ serverPluginsDir: string เอาไว้ใน qwikCity() ก่อน (ที่เดียวกับ rewrite)
//* ตรง path ให้เราใส่ string path ที่ชี้มายัง directory ที่เราจะเก็บ plugin ต่าง ๆ เอาไว้ (ทั่วไปจะเป็น src/plugins)
//* หลังจากนั้นก็ให้สร้างไฟล์เอาไว้ที่ plugins โดยจะใช้ prefix 'plugin@' นำหน้าและตามด้วย 'ชื่อ.ts'

//* ด้านล่างจะเห็นว่ามี function อยู่สองตัวสำหรับเอาไว้ทำ type narrowing
//* สมมติว่าเรามีตัวแปรไม่ทราบ type อยู่ตัวหนึ่ง (unknown) และเราอยากเช็คดูว่ามันมีคุณสมบัติที่เราต้องการไหม
//* เช่น เป็น object ที่สร้างจาก instance นี้ไหม? มี property นี้ใน object ไหม? แล้ว property มีค่าเป็น null หรือเปล่า?
//* ถ้า logic การตรวจสอบเราผ่านทั้งหมด แปลว่า TypeScript ก็จะรู้แล้วว่าค่าที่เราตรวจสอบมามีหน้าตาประมาณไหน
//* type ที่ส่งกลับก็จะเป็น T จาก parameter is T เลย
//* อธิบาย process ง่าย ๆ: ตัวแปรที่รับมาไม่รู้ค่า ตรวจสอบค่าด้านใน ส่งค่า boolean กลับ ถ้าส่ง true ตัวแปรจะเป็น type T

export const onRequest: RequestHandler = async (requestEvent) => {
  console.log("This is middleware from plugin");

  try {
    return await requestEvent.next();
  } catch (error) {
    if (isServerError(error)) {
      throw error;
    }

    if (isRedirectMessage(error)) {
      throw error;
    }
  }
};

function isServerError(error: unknown): error is ServerError {
  return (
    error instanceof ServerError ||
    (isDev &&
      error instanceof Error &&
      error.constructor.name === "ServerError")
  );
}

function isRedirectMessage(error: unknown): error is RedirectMessage {
  return (
    error instanceof RedirectMessage ||
    (isDev &&
      error instanceof Error &&
      error.constructor.name === "RedirectMessage")
  );
}
