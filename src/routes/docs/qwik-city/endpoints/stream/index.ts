import type { RequestHandler } from "@builder.io/qwik-city";

//* การส่งข้อมูลแบบ streaming จะส่งข้อมูลมาทีละหน่อย ต่างจากแบบเดิมที่ส่งมาทีเดียว (เช่น REST api)
//* ทำให้การจัดการ request / response ก็จะต่างจากปกติ
//* อันดับแรกเราจะมาพูดถึงการส่งข้อมูลแบบ streaming กันก่อน
//* ให้เราใช้ .getWritableStream() จาก requestEvent เพื่อจะนำมาใช้สร้างตัวแปรที่จำเป็นต่อ
//* ตัวแปรที่ว่าก็คือ writableStream.getWriter() ที่จะเอาไว้เขียนข้อมูล chunk ที่เราต้องการ
//* จะได้ const writableStream = requestEvent.getWritableStream() ก่อน
//* และ const writer = writableStream.getWriter() เป็นลำดับต่อมา
//* ข้อมูลที่เราจะส่ง จะส่งไปทั้งอย่างนั้นเลยก็ไม่ได้เหมือนกัน จะต้องใช้ encoder เข้าช่วย
//* เราก็จะได้ const encoder = new TextEncoder() มาเป็นตัวที่สาม
//* ปกติแล้วเราก็จะใช้ writer.write(encoder.encode(chunk)) เพื่อแปลงข้อมูลให้อยู่ในรูปที่ต้องการและส่งเป็น stream ได้เลย
//* ข้อมูลที่เราจะทำการ encode จะต้องอยู่ในรูปแบบ string เท่านั้น (ตามชื่อ "Text"Encoder)
//* ส่วนเรื่องการสั่งให้รอเราจะต้องเขียน function เอาเอง
//* โดยการเขียน function ให้รอการทำงานบางอย่างก็คือ async function นั่นแหละ (จะอธิบายหลังเรื่อง Stream อีกที)
//* ตอนนี้เราก็จะมีวัตถุดิบครบถ้วนแล้ว ได้แก่ writer ที่ได้มาจาก writableStream, ตัว encoder และ delay function
//* ในการเขียนส่ง stream data เราจะใช้ writer.write(encoder.encode(data: string))
//* แปลง่าย ๆ ก็คือ "นำ string ไป encode แล้วส่ง stream กลับไป"
//* แล้วเราก็เรียก delay function เพื่อทำการรอ และปิดท้ายด้วยการบอกว่าพร้อมส่งข้อมูล chunk ถัดไปแล้วนะด้วย writer.ready
//* สุดท้าย เมื่อเราเขียน logic streaming เสร็จแล้วก็ให้เราใช้ writer.close() เพื่อบอกว่าการส่งข้อมูลเสร็จสิ้นแล้ว
//* เมื่อเราลอง fetch ไปที่ endpoint streaming ของเรา เราจะเห็นว่า "อ้าว ไม่เห็นส่งข้อมูลมาทีละหน่อยเลย รอทีเดียวแถมช้ากว่าเดิมอีก"
//* นั่นเป็นเพราะ buffer จะอธิบายด้านล่าง async อีกที

//* มาพูดถึงเรื่อง async function / promise เพิ่มเติม (เผื่อขี้เกียจไปอ่านหัวข้อเต็ม ๆ)
//* เวลาเราจัดการกับ asynchronous function เราจะต้องเจอกับ return type ประเภท Promise<T> อยู่ตลอด
//* สมมติว่าเรามีโค้ด const name = new Promise<string>((resolve) => resolve('Something'))
//* ถ้าเราเรียกใช้งาน const myName = name; แทนที่เราจะได้ค่า 'Something' เราจะได้ Promise<string> แทน
//* การเรียกใช้อะไรที่ต้องรอผลลัพธ์ มันจะส่งตัวแทนของผลลัพธ์กลับมาให้เราก่อน
//* นึกภาพง่าย ๆ ก็เหมือนบัตรคิว เราอยากกิน BBQ Plaza เราไปต่อคิว พนักงานจะให้บัตรคิว (Promise) มาก่อน
//* Promise จะเป็นเหมือนสิ่งที่บอกว่า "รอแปปนึงให้โค้ดข้างในทำงานก่อนแล้วค่อยจัดการอีกที เอา Promise ไปถือเป็นหลักประกันไว้ก่อน"
//* จากนั้นพอถึงคิวของเราแล้ว (โค้ด async ด้านในทำงานเสร็จ) เราถึงจะนำบัตรคิวไปให้พนักงาน (then) เพื่อเข้าใช้บริการได้ (data)
//* โค้ดตรง then จะเป็นสิ่งที่บอกเราว่า "ถ้าของได้แล้วให้ทำยังไงต่อดี"
//* เช่น name.then((value) => console.log(value)) ที่จะเข้าถึงค่าข้างใน Promise แล้ว log ออกมา
//* มี catch ให้ใช้สำหรับจัดการกรณีที่การ resolve Promise นั้นเกิด error เหมือนกัน เขียนเหมือน then เลย
//* และสุดท้าย finally ที่ไม่ว่าจะ resolve สำเร็จหรือไม่ก็จะทำงานเสมอ
//* อย่าง await ที่เราใช้มาตลอดในเกือบทุกตัวอย่างที่มี requestEvent ก็คือการบอกให้รอ Promise แล้วเอาผลลัพธ์มาเลย ไม่ต้องนั่งทำเอง
//* ส่วนการสร้างจะเขียนในรูป Promise<T>((resolve, reject) => ...)
//* โดย resolve / reject ก็เหมือนกันนั่นแหละ ห่อข้อมูลเอาไว้แล้วส่งกลับ
//* แต่สิ่งเดียวที่ต่างกันก็คือ resolve จะส่งสถานะสำเร็จไปให้ Promise (.then ได้)
//* แต่ reject จะส่งสถานะล้มเหลวไปให้แทน (เข้ากรณี .catch)
//* จะเห็นในตัวอย่างโค้ดของบทนี้ว่าเราไม่ได้ส่งค่าอะไรกลับไปเลย มีแค่ resolve เปล่า ๆ ไม่ได้ห่อค่าอะไรไว้
//* ก็คือการบอกว่า ไม่ต้องส่งอะไรกลับไป เป็น Promise เปล่า ๆ แกะออกมาก็ไม่เจออะไร
//* ที่ต้องเป็นอย่างนั้นเพราะว่าเราจะนำมาเขียน delay ด้วย setTimeout() เฉย ๆ

//* อธิบาย buffer เพิ่มเติม
//* เวลาที่เราส่งข้อมูล streaming แล้วเกิดการรอครบทีเดียวค่อยส่งมาที่ server จะเกิดจาก buffer ของ browser
//* พูดให้เห็นภาพง่าย ๆ ก็คือ เหมือนมีถังน้ำตั้งอยู่ระหว่าง client กับ server
//* เวลาที่ server ส่งข้อมูลมาทีละนิด ก็จะนำข้อมูลนั้นมาใส่ถังเอาไว้ก่อน รอส่งเสร็จหรือถังเต็มแล้วค่อยส่งไปให้ client
//* และเฉลี่ย ความจุของถังน้ำที่ว่านี่ก็คือ 1-6 kb ทำให้ข้อมูลถ้าเราส่งไปน้อยจะต้องเก็บเอาไว้ในถังอยู่แล้ว
//* หนึ่งในวิธีแก้ไขชั่วคราวก็คือการส่งข้อมูลไปก่อนล่วงหน้าเพื่อเอา flush buffer ให้ส่งไปให้ client ก่อน จะได้เริ่มทำ streaming ได้
//* เช่น เราส่ง string อะไรก็ได้ .repat(2048) ก็จะได้ข้อมูลประมาณ 2 kb ส่งไปให้กับ buffer ทำให้ buffer ต้อง flush ออก
//* หลังจาก flush เราถึงจะเห็นข้อมูลมาเป็นชุด ๆ ตามหลักการ stream
//* กับอีกวิธีที่ดีกว่าก็คือการตั้งค่า headers ซึ่งเราจะอธิบายต่อใน sse

export const onGet: RequestHandler = async (requestEvent) => {
  const name = new Promise<string>((resolve) => resolve("Athiseen"));
  const unresolveName = name;
  const resolvedName = await name;

  const writableStream = requestEvent.getWritableStream();
  const writer = writableStream.getWriter();
  const encoder = new TextEncoder();

  const wait = (ms: number) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  };

  try {
    writer.write(encoder.encode("This is endpoints!\n"));
    await wait(2000);
    await writer.ready;

    writer.write(encoder.encode("Streaming data!\n"));
    await wait(2000);
    await writer.ready;

    writer.write(encoder.encode("Streaming end!\n"));
  } catch (error) {
    console.error(error);
  } finally {
    writer.close();
  }
};
