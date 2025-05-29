import {
  component$,
  useId,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

//* เริ่มด้วยการสร้าง component ง่าย ๆ
//* ให้ใช้ component$() ในการสร้าง function-based component (React-like syntax)
//* โดย component$() จะรับค่า callback ที่จะ return html กลับมา
//* กล่าวคือ เราจะเขียนทั้ง HTML, TS ในที่เดียวกันเลย (นอก return จะเป็น TS, return จะเป็น HTML)

export const Overview = component$(() => {
  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
});

//* ในการนำไปใช้ก็ให้ใช้ชื่อ const ที่เราตั้งเอาไว้เป็นชื่อ tag ได้เลย (import ไปใช้เอา)

export const OverviewUsage = component$(() => {
  return (
    <>
      <Overview />
    </>
  );
});

//* Qwik จะ encourage ให้เราใช้ signal แทนการสร้างตัวแปรปกติด้วย let / const
//* เพราะว่า signal เป็น reactive value ทำให้ Qwik สามารถ track / re-render ได้เมื่อ signal เปลี่ยนค่า
//* และเนื่องด้วยเป็น reactive value จึงต้องเข้าถึงด้วย .value ไม่ได้เรียกใช้ตรง ๆ
//* ใช้ useSignal() ในการสร้าง signal โดยข้างใน () จะเป็น default value ของ signal

export const SignalExample = component$(() => {
  const counter = useSignal(0);

  return (
    <>
      <div>
        <h3>Counter value: {counter.value}</h3>
        <button onClick$={() => counter.value++}>Increase</button>
      </div>
    </>
  );
});

//* เราสามารถบังคับได้ว่าเวลานำ component นี้ไปใช้งานจะต้องส่งค่าอะไรมากับ tag บ้าง
//* ทำได้โดยการแปะ generics type ให้กับ component$<T>()
//* T ที่เราแปะไปก็คือ input ของ tag ที่หากเรานำไปใช้จะต้องใส่มา ไม่งั้นจะขึ้น error
//* เราจะเขียน type ตรง generic ก็ได้ แต่แนะนำให้ใช้ interface จะเป็นระเบียบมากกว่า
//* และด้านใน () ของ callback ให้เราใส่ตัวแปรไปหนึ่งตัว เป็นตัวแทนของข้อมูลที่เรารับมาจาก tag
//* เช่น component$<SomeProps>((props) => { ... })
//* เราก็จะใช้ props เข้าถึงข้อมูลได้ตาม interface เลย e.g., props.name, props.age, etc.

interface PropsExample {
  title: string;
  description: string;
}

export const ComponentProps = component$<PropsExample>((props) => {
  return (
    <>
      <div>
        <h3>Title: {props.title}</h3>
        <p>Description: {props.description}</p>
      </div>
    </>
  );
});

//* การส่ง props มาอีกรูปแบบคือการนำ interface ไปแปะเอาไว้ให้กับตัวแปรใน callback แทน

interface AlternativePropsExample {
  title: string;
  description: string;
}

export const AlternativeProps = component$((props: AlternativePropsExample) => {
  return (
    <>
      <div>
        <h3>Title: {props.title}</h3>
        <p>Description: {props.description}</p>
      </div>
    </>
  );
});

//* และอีกแบบก็คือการ destructuring ออกมาจาก props เพื่อนำไปใช้งานเลยไม่ต้องเรียกผ่านตัวแปร

interface DestructuringPropsExample {
  title: string;
  description: string;
}

export const DestructuringProps = component$<DestructuringPropsExample>(
  ({ title, description }) => {
    return (
      <>
        <div>
          <h3>Title: {title}</h3>
          <p>Description: {description}</p>
        </div>
      </>
    );
  }
);

//* บางครั้งเราก็อยากให้ props ของเราเป็น optional แต่ติดปัญหาว่าถ้าเราไม่ส่งมาก็จะเป็น undefined
//* แก้ปัญหานี้ได้โดยการ assign ค่าให้ตอนที่เราทำ destructuring ทำให้มีค่าเริ่มต้นแทนที่จะเป็น undefined
//* ถ้าเราส่งมาก็ใช้ค่าใหม่ ถ้าไม่ส่งทีนี้ก็จะได้ค่า default ที่เรา assign เอาไว้

interface DefaultPropsExample {
  title?: string;
  description?: string;
}

export const DefaultProps = component$<DefaultPropsExample>(
  ({
    title = "Default Props!",
    description = "This is from Default Props!",
  }) => {
    return (
      <>
        <div>
          <h3>Title: {title}</h3>
          <p>Description: {description}</p>
        </div>
      </>
    );
  }
);

//* เราสามารถใช้ useSignal() เพื่ออ้างอิงถึง element ก็ได้
//* โดยเราจะใช้ <HTMLElement> แปะเอาไว้ให้กับ useSignal() กลายเป็น useSignal<HTMLElement>()
//* ในการอ้างอิงไปยัง element ที่เราต้องการ เราจะใช้ ref={value} เพื่อผูกค่า signal เข้ากับ element
//* แต่หลายครั้ง กรณีที่เราต้องการจัดการกับ element เราจะต้องจัดการหลังจากที่มัน render เสร็จแล้ว
//* เราก็เลยต้องใช้ useVisibleTask$() และดึงค่าของ element ที่เราอยากได้ในนั้นแทน
//* ถ้าดึงนอก useVisibleTask$() เราจะไม่ได้อะไร เพราะว่า element ยังไม่ถูก render

export const ElementAccess = component$(() => {
  const element = useSignal<HTMLElement>();
  const height = useSignal(0);
  const width = useSignal(0);

  useVisibleTask$(() => {
    const rect = element.value?.getBoundingClientRect();

    if (rect) {
      height.value = rect.height;
      width.value = rect.width;
    }
  });

  return (
    <>
      <div
        style={{
          height: "100px",
          width: "100px",
          backgroundColor: "dodgerblue",
        }}
        ref={element}
      ></div>

      <p>Height: {height.value}</p>
      <p>Width: {width.value}</p>
    </>
  );
});

//* นอกจากการใช้ ref เพื่ออ้างอิงถึง element แล้วเราก็สามารถใช้ DOM API เพื่อเข้าถึง element ได้เหมือนกัน
//* หลักการเดียวกับ ref แต่เปลี่ยนไปใช้ document.getElementById() แทน (ต้องรู้ค่า id ของ element นั้น)

export const ElementAccessByDomApi = component$(() => {
  const id = `element-${useId()}`;
  const elementId = useSignal<string | null>(null);

  useVisibleTask$(() => {
    const element = document.getElementById(id);

    if (element) {
      elementId.value = element.getAttribute("id");
    }
  });

  return (
    <>
      <div id={id}></div>

      <p>Your element id: {id}</p>
      <p>And element id from DOM: {elementId.value}</p>
    </>
  );
});
