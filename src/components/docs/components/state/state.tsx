import {
  $,
  component$,
  QRL,
  Resource,
  useComputed$,
  useResource$,
  useSignal,
  useStore,
} from "@builder.io/qwik";

//* อย่างที่บอกไปใน chapter overview เราจะใช้ useSignal() ที่สร้าง reactive value แทนการใช้ let / const ปกติ

export const State = component$(() => {
  const counter = useSignal(0);

  return (
    <>
      <h3>Counter value: {counter.value}</h3>
      <button
        onClick$={() => {
          counter.value++;
        }}
      >
        Click
      </button>
    </>
  );
});

//* นอกจาก useSignal ที่แทนตัวแปรปกติแล้ว Qwik ก็ยังมี useStore เพื่อใช้สร้าง reactive value ในรูปแบบ object
//* ไม่จำเป็นที่จะต้องเข้าถึง property ของ store ด้วย .value เราสามารถ .property ได้เลยเหมือน object ปกติ
//* สามารถสร้าง interface มาแปะเอาไว้กับ useStore<T>() เพื่อทำ type safety ได้

export const Store = component$(() => {
  const userStore = useStore({
    name: "Athiseen",
    age: 26,
  });

  return (
    <>
      <div>
        <h3>Hello, {userStore.name}</h3>
        <p>Age: {userStore.age}</p>
      </div>
    </>
  );
});

//* useStore ไม่ได้จำกัดแค่ว่าจะต้องมีแต่ property เท่านั้น สามารถมี method ข้างใน store ก็ได้
//* ให้เราครอบ function ด้วย $() จากนั้นจึงจะเขียนในรูปแบบ function ปกติ ไม่ใช่ callback
//* เช่น $(function (parameters: T) { ... })
//* เนื่องจากหลายครั้งที่เราจะต้องเรียกข้อมูลภายใน store ใน method ที่อยู่ใน store เดียวกัน
//* เราจึงจะต้องใส่ this: T เข้าไปเป็น argument ให้กับ store method นั้น ๆ
//* และ callback เราจะไม่สามารถส่ง this: T เข้าไปได้ ทำให้เราจะต้องเขียนในรูปแบบ function () {} แทน
//* ส่วน T ก็คือ type ของ store เองนั่นแหละ

//* สำคัญอีกเรื่องก็คือถ้าเกิดเราต้องทำ type ให้ store แล้วเราจะเขียน type ของ method นั้นยังไง
//* ให้เราใช้ QRL<T> เป็น value ให้กับ method ใน interface
//* โดย T ก็คือ callback ของ method ตัวนั้น ๆ ที่เราจะเขียนในรูปแบบ type ของ function
//* เช่น QRL<(x: number, b: number) => number> ก็คือการรับค่า 2 arguments ที่เป็น number และส่งค่า number กลับไป
//* ในกรณีที่เราต้องจัดการกับ store ตัวเอง (method อยู่ใน store เดียวกันกับ property) ให้เราใช้ this: T เป็น argument
//* T ก็คือ type ของ store ของตัว method เองนั่นแหละ เหมือนกับการเขียน $() ด้านบนเลย

interface CounterStore {
  counter: number;
  increment: QRL<(this: CounterStore) => void>;
}

export const StoreWithQrl = component$(() => {
  const counterStore = useStore<CounterStore>({
    counter: 0,
    increment: $(function (this: CounterStore) {
      this.counter++;
    }),
  });
  return (
    <>
      <div>
        <h3>Counter value: {counterStore.counter}</h3>
        <button onClick$={() => counterStore.increment()}>Click</button>
      </div>
    </>
  );
});

//* ในกรณีที่เราจะต้อง transform ข้อมูลเราบ่อย ๆ ก่อนนำไปแสดง ให้เราใช้ useComputed$() ในการสร้าง signal แทน
//* เข้าถึงค่าได้ผ่าน .value เหมือนกับ useSignal()
//* เหตุผลหลัก ๆ ที่เราจะใช้ useComputed$() มี 3 ข้อ
//* ข้อแรก useComputed$() จะ cache ข้อมูลที่ตัวมันเองคำนวณเอาไว้ หากไม่เปลี่ยนแปลงก็จะไม่คำนวณใหม่
//* เช่น เรามี <p>{name.value + ' Doe'}</p> 3 ตัว จะเกิดการคำนวณขึ้น 3 ครั้ง แต่ถ้าใช้ useComputed$() จะเกิดการคำนวณครั้งเดียว
//* ข้อสอง แยก logic การคำนวณออกจาก JSX ทำให้โค้ดสะอาดขึ้น
//* และข้อสุดท้าย จากเหตุผลข้อแรก การใช้ useComputed$() จะทำให้ performance ดีกว่า (กรณีใช้ซ้ำหลายที่)

export const UseComputedExample = component$(() => {
  const name = useSignal("");
  const uppercaseName = useComputed$(() => {
    return name.value.toUpperCase();
  });

  return (
    <>
      <input type="text" bind:value={name} />
      <p>Your name: {uppercaseName.value}</p>
    </>
  );
});

//* useResource$<T>() จะใช้ในการดึงข้อมูลจากภายนอก (API, Database, etc.)
//* ในการนำข้อมูลไปแสดง ให้ใช้ element <Resource /> ในการจัดการกับ useResource$() แทน tag ปกติ
//* ใน Resource จะมี attribute ให้ใช้หลัก ๆ 3 ตัว คือ value, onPending, onResolved
//* value เอาไว้ผูกกับ useResource$() ที่เราสร้าง
//* onPending เอาไว้แสดงข้อมูลระหว่างที่ useResource กำลังทำ async operation
//* onResolved เอาไว้แสดงข้อมูลที่เรา return มาจาก useResource$()
//* onPending / onResolved จะรับ callback เป็น parameter โดยให้เราส่ง HTML กลับมา
//* onPending จะพิเศษกว่า onResolved ตรงที่เราสามารถรับ argument 1 ตัวที่จะแทนที่ค่าที่ถูกส่งกลับมาจาก useResource$()
//* ทำให้เราสามารถนำค่าที่ได้รับกลับมาไปแสดงผลต่อได้
//* เช่น <Resource value={someValue} onPending={() => <h1>Wait</h1>} onResolved={(value) => <h1>{value}</h1>} />
//* อย่างไรก็ตามเราสามารถแปะ generics ให้กับ useResource$() ได้ กรณีที่เรารู้ว่าต้องการ return type อะไร
//* และถ้าเราต้องการให้ดึงข้อมูลใหม่หากค่าที่เราสนใจเปลี่ยนแปลงจะต้อง destructuring track ส่งเข้าไปใน callback ของ useResource$()
//* เช่น useResource<string>(async ({ track }) => { ... })
//* และให้เราประกาศ track(() => value) เอาไว้ โดย value ก็คือค่าที่เราสนใจ หากเปลี่ยนเมื่อไร useResource$() จะทำงานอีกครั้ง

export const UseResourceExample = component$(() => {
  const postId = useSignal(1);

  const postTitle = useResource$<string>(async ({ track }) => {
    track(() => postId.value);

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId.value}`
    );
    const data = await response.json();

    return data.title as string;
  });

  return (
    <>
      <input type="number" min={1} max={100} bind:value={postId} />
      <Resource
        value={postTitle}
        onPending={() => <p>loading...</p>}
        onResolved={(post) => <p>{post}</p>}
      />
    </>
  );
});
