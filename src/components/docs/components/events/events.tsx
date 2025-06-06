import {
  $,
  component$,
  QRL,
  useOnDocument,
  useOnWindow,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

//* ใน Qwik เราจะใช้ onClick$() ในการเขียน inline event
//* ให้เราส่ง callback เข้าไปใน onClick$() อีกที เพื่อกำหนดการทำงานของ event ที่จะเกิดขึ้นเมื่อ click

export const Events = component$(() => {
  return (
    <>
      <button onClick$={() => alert("Clicked!")}>Click</button>
    </>
  );
});

//* เราสามารถทำ two-way binding ได้ด้วย bind:value={value}

export const BindValue = component$(() => {
  const value = useSignal("");

  return (
    <>
      <input type="text" bind:value={value} />
      <p>Your name: {value.value}</p>
    </>
  );
});

//* ในกรณีที่เราต้องการใช้ event ซ้ำหลายครั้ง ให้เราเขียนโดยใช้ $() ครอบ callback เอาไว้แล้วนำไปสร้างเป็นตัวแปร
//* ตัวแปรนั้นสามารถนำไปประกาศบน onEvent$ ได้เลย

export const ReusingEvents = component$(() => {
  const duplicateEvent = $(() => {
    alert("Duplicate event!");
  });

  return (
    <>
      <button onClick$={duplicateEvent}>Reuse</button>
    </>
  );
});

//* เราสามารถสั่ง trigger event ได้ทีเดียวหลายตัวด้วยการใช้ [] ใน {} ของ event
//* เช่น onClick$={[event1, event2, ...]}
//* มีข้อจำกัดเพียงอย่างเดียวคือจะต้องเป็น QRL function เท่านั้น (ครอบด้วย $())

interface StoreEvent {
  storeEvent: QRL<() => void>;
}

export const MultipleEvents = component$(() => {
  const logEvent = $(() => {
    console.log("Event triggered!");
  });

  const storeEvent = useStore<StoreEvent>({
    storeEvent: $(function () {
      console.log("Store event triggered!");
    }),
  });

  return (
    <>
      <button
        onClick$={[
          logEvent,
          storeEvent.storeEvent,
          $(() => {
            console.log("Inline event triggered!");
          }),
        ]}
      >
        Multi
      </button>
    </>
  );
});

//* เราสามารถเข้าถึง event object ได้ด้วยการส่งผ่านไปยัง callback ของ event เลย
//* เช่น $((event: MouseEvent) => { ... }) หรือ onClick$={(event) => { ... }}
//* สำคัญคือต้องประกาศ type ของ event ให้ถูกต้อง ถ้าเกิดจะใช้ QRL function

interface AxisStore {
  x: number;
  y: number;
}

export const EventObject = component$(() => {
  const axisStore = useStore<AxisStore>({
    x: 0,
    y: 0,
  });
  const clickHandler = $((event: MouseEvent) => {
    axisStore.x = event.clientX;
    axisStore.y = event.clientY;
  });

  return (
    <>
      <div
        style={{ height: "300px", width: "300px", backgroundColor: "red" }}
        onMouseMove$={clickHandler}
      ></div>

      <p>X: {axisStore.x}</p>
      <p>Y: {axisStore.y}</p>
    </>
  );
});

//* บาง tag เราสามารถยกเลิกการทำงานเบื้องต้นของมันได้ เช่น click บน anchor, etc.
//* ให้เราใช้ preventdefault:event เพื่อยกเลิกการทำงานของ event นั้น ๆ
//* เช่น <a href="..." preventdefault:click>Click</a>

export const PreventDefault = component$(() => {
  return (
    <>
      <a href="./docs/components/state" preventdefault:click>
        Navigate
      </a>
    </>
  );
});

//* ก่อนที่เราจะไปรู้จัก stoppropagation:event เราก็ต้องรู้จักกับ Event Propagation (หรือ Event Flow) กันก่อน
//* อธิบายคร่าว ๆ คือ นอกจาก event จะ trigger แล้วก็จะมีการกระจาย event ต่อไปยังส่วนอื่น ๆ ของ DOM Tree ด้วย
//* เวลาที่เกิด event ขึ้น การกระจายตัวจะเริ่มจาก window วิ่งไปยัง document และไล่ไปตาม parent จนถึง target element
//* และขากลับก็จะกลับทางเดียวกันจาก target element ไปยัง window
//* จะได้ window -> document -> parents -> target -> parents -> document -> window
//* ขาไปจะถูกเรียกว่า Capture Phase พอถึง target element ก็จะเป็น Target Phase และขากลับเรียกว่า Bubbling Phase
//* Capture Phase ตอน event วิ่งจาก window ไปยัง target ก็จะ trigger event ของตัวที่ผ่านเหมือนกัน
//* แต่ว่าจะ trigger เฉพาะตัวที่ประกาศ { capture: true } เอาไว้เท่านั้น
//* Target Phase ก็คือ Phase ที่ event วิ่งมาจนถึง target element
//* สุดท้าย Bubbling Phase ก็คือขากลับที่จะ trigger event เดียวกันของ element ทุกตัวที่ผ่าน
//* ตัวอย่างเช่น หากเรามี div 2 ตัวซ้อนกันอยู่ ตัวนอกชื่อ outer div ตัวในชื่อ inner div โดยทั้งสองจะมี click event เหมือนกัน
//* เมื่อ event trigger ที่ inner div ก็จะเกิดการกระจาย event จาก window -> document -> outer -> inner
//* ขาไปจะยังไม่เกิดอะไรขึ้น เพราะทั้งสองตัวไม่ได้ถูกประกาศ { capture: true }
//* พอถึง target element ก็จะ trigger event ของ inner div
//* จากนั้นขากลับก็จะ trigger event ของ outer div ตามลำดับ
//* stoppropagation:event จึงมีเอาไว้เพื่อหยุดการกระจายตัวของ event ในช่วง Bubbling Phase
//* จากตัวอย่างเดิม หากเราระบุ stoppropagation:click เอาไว้ที่ inner div ตรง outer div ก็จะไม่เกิด event ขึ้น
//* จำง่าย ๆ ก็คือ window ไป doc ไป parent ไป target ถึง target ก็ trigger และกลับทางเดิม
//* ขาไปจะไม่ถูก trigger ถ้าเกิดไม่มี capture: true ส่วนขากลับจะถูก trigger เสมอ ถ้าไม่มี stoppropagation คั่นเอาไว้

export const StopPropagation = component$(() => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          height: "300px",
          width: "300px",
          backgroundColor: "red",
        }}
        onClick$={() => console.log("Outer div clicked")}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            height: "200px",
            width: "200px",
            backgroundColor: "blue",
          }}
          onClick$={() => console.log("Center div clicked")}
          stoppropagation:click
        >
          <div
            style={{
              height: "100px",
              width: "100px",
              backgroundColor: "green",
            }}
            onClick$={() => console.log("Inner div clicked")}
          ></div>
        </div>
      </div>
    </>
  );
});

//* เราสามารถส่ง currentTarget ไปเป็น argument ตัวที่สองต่อจาก event ได้
//* currentTarget ก็คือ HTML ตัวที่เป็น target ของ event นั้น ๆ
//* เช่น <div onClick$={(event, currentTarget) => { ... }} /> จากตัวอย่างนี้ currentTarget ก็คือ element div นี่แหละ

export const CurrentTarget = component$(() => {
  const targetElemenet = useSignal<HTMLElement | null>(null);
  const currentElement = useSignal<HTMLElement | null>(null);

  return (
    <>
      <div
        onClick$={(event, currentTarget) => {
          targetElemenet.value = event.target as HTMLElement;
          currentElement.value = currentTarget;
        }}
      >
        <h1>Hello</h1>
        <h2>World</h2>
        <h3>Just kidding!</h3>
      </div>

      <p>Target: {targetElemenet.value?.tagName}</p>
      <p>Current: {currentElement.value?.tagName}</p>
    </>
  );
});

//* เราสามารถเพิ่ม EventListener เอาเองเลยก็ได้ แค่ ref element เข้ากับ signal แล้วก็ใช้ .addEventListener เอา
//* note เพิ่มอีกอย่างคือนอกจาก track แล้วเราก็ยังสามารถส่ง cleanup เข้าไปใน lifecycle ได้ด้วย
//* การใช้งานอะไรก็เหมือน track() เลย ที่จะรับ callback เข้าไป
//* เอาไว้ใช้สำหรับ reset ข้อมูลที่เราต้องการ เช่น ลบ event ออกก่อนจะเพิ่มเข้าไปใหม่

export const SyncEvent = component$(() => {
  const elementRef = useSignal<HTMLElement>();

  useVisibleTask$(({ cleanup }) => {
    elementRef.value?.addEventListener("click", () => {
      console.log("Event created!");
    });

    cleanup(() => {
      elementRef.value?.removeEventListener("click", () => {
        console.log("Event removed!");
      });
    });
  });

  return (
    <>
      <button ref={elementRef}>Click</button>
    </>
  );
});

//* บางครั้งเราก็ต้องการจะสร้าง event เอาเอง ทำได้โดยการสร้าง interface / type ที่กำหนดรับ QRL function
//* ให้เรานำ interface / type ไปแปะเอาไว้ให้กับ component$() เพื่อรับค่า input จาก tag
//* ซึ่ง input ที่เราจะรับจาก tag เป็น QRL ดังนั้นเราจะกำหนดการทำงานของ function นี้ได้ใน tag เท่านั้น
//* จากนั้นใน component ก็ให้เรียกใช้งาน function นี้เพื่อ trigger custom event ที่เรารับมา

interface ButtonProps {
  customClick$: QRL<() => void>;
}

export const CustomEvent = component$<ButtonProps>((props) => {
  return (
    <>
      <button
        onClick$={() => {
          props.customClick$();
        }}
      >
        Custom
      </button>
    </>
  );
});

//* จากที่เราทำมา เราจัดการ event อยู่บน element ภายใต้ document มาตลอด
//* เราสามารถจัดการกับ event บน document / window ได้โดยการใช้ useOnDocument() และ useOnWindow()
//* ซึ่ง useOn สองตัวจะรับค่าเหมือนกัน ตัวแรกคือ string ที่เป็นประเภทของ event และอีกตัวคือ QRL function ว่าจะทำอะไร
//* ความต่างของ window กับ document คือ window จะเป็น object สูงสุด (browser) แต่ document จะหมายถึง HTML ในหน้านั้น
//* เราสามารถเข้าถึง document ผ่าน window.document ก็ได้เหมือนกัน

function UseMousePosition() {
  const position = useStore({ x: 0, y: 0 });

  useOnDocument(
    "mousemove",
    $((event: MouseEvent) => {
      position.x = event.clientX;
      position.y = event.clientY;
    })
  );

  return position;
}

export const UseOnDocument = component$(() => {
  const position = UseMousePosition();

  return (
    <>
      <div>
        Your mouse position: x{position.x}, y{position.y}
      </div>
    </>
  );
});

function WindowClickCount() {
  const count = useSignal(0);

  useOnWindow(
    "click",
    $(() => {
      count.value++;
    })
  );

  return count;
}

export const UseOnWindow = component$(() => {
  const count = WindowClickCount();

  return (
    <>
      <button
        onClick$={() => {
          alert("Click here as well!");
        }}
      >
        Alert
      </button>

      <p>Window click: {count}</p>
    </>
  );
});
