import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h3>Pages</h3>
    </>
  );
});

//* หน้า page นอกจากเราจะเขียน return HTML กลับไปแล้ว เรายังสามารถเขียนข้อมูล head ให้กับ browser ได้อีก
//* ให้เราใช้ export ตัวแประประเภท DocumentHead เพื่อทำการเขียนข้อมูลให้กับ route นี้
//* อันดับแรกก็คือเราจะเขียน assign object โดยตรงหรือ callback แล้วค่อย return object กลับมาก็ได้
//* เราจะใช้ title เพื่อตั้งค่าชื่อของ tab บน browser
//* เช่น export const head: DocumentHead = { title: 'Something' }; เราก็จะเห็นชื่อ tab ว่า Something
//* นอกจาก title ซึ่งเป็นสิ่งที่เรามองเห็นได้ด้วยตาเปล่าบน tab แล้ว เราก็ยังมี meta, OG, canonical อีก
//* สำหรับ meta, OG เราสามารถเขียนเอาไว้ใน meta: [] ได้ ถ้า canonical จะต้องเขียนผ่าน links: []
//* แปลว่านอกจาก title แล้วเราจะสามารถประกาศ key เพิ่มได้อีก 2 ตัว รวมทั้งหมดคือ title, meta, และ links
//* ด้านใน array ให้เราเขียนเอาไว้ในรูปแบบ Record<key, value> เหมือนกัน
//* ตัวหลัก ๆ ที่เราจะใช้ทำ meta, OG คือ name, property, และ content
//* ถ้าเคยเล่น social media จะเห็นว่าบางครั้ง เวลาเราวาง link บนเราจะเห็นว่ามีรูปภาพ ชื่อ คำอธิบาย ฯลฯ อยู่กับ link ด้วย
//* แต่บาง link จะไม่มี สาเหตุก็เพราะมีหรือไม่มี meta นั่นแหละ
//* name จะเป็นชื่อของ preview ส่วน content ก็จะเป็น content ของ preview
//* ถ้าเราเขียน 2 อย่างนี้ เวลานำ link ไปวางเราก็จะเห็นเป็นหัวข้อ / คำอธิบายที่เราระบุเอาไว้ใน name, content
//* property จะมีเอาไว้สำหรับการทำ Open Graph ที่จะเกี่ยวข้องกับ SEO โดยตรง ให้หาอ่านได้ที่ site ของ OG เลย
//* ตัว OG เราจะเขียนในรูปแบบ property: string, content: string คล้าย ๆ กับ meta แค่เปลี่ยนจาก name เป็น property
//* ส่วนการทำ canonical ก็จะเกี่ยวข้องกับ SEO เหมือนกัน เป็นเรื่องของ href ว่าถ้าชื่อ link คล้ายกัน อันไหนเป็นตัว base กันแน่
//* เขียนเหมือนกับตอนเราเขียน meta: [] แค่เปลี่ยน key เป็น rel และ href แทน
//* ข้อมูลสามารถหาอ่านเพิ่มเติมเอาเองได้เลย (Open Graph, Canonical)

export const head: DocumentHead = {
  title: "Qwik City: Pages",

  meta: [
    { name: "Qwik City: Meta name", content: "Qwik City: Meta content" },
    { property: "og:title", content: "Qwik City: OG title" },
    { property: "og:description", content: "Qwik City: OG description" },
  ],

  links: [
    { rel: "canonical", href: "http://localhost:5173/docs/qwik-city/pages" },
  ],
};
