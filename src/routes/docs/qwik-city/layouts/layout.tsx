import { component$, Slot } from "@builder.io/qwik";

//* ตัวอย่างให้เห็นชัดมากขึ้นเรื่อง layouts ที่ระบุเอาไว้ใน routing
//* เวลาเรากดไปอีกหน้าก็จะ render route นั้น ๆ บน <Slot /> ของ layout.tsx

export default component$(() => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          style={{ height: "20%", width: "100%", backgroundColor: "tomato" }}
        >
          Header
        </div>

        <div style={{ flex: 1 }}>
          <Slot />
        </div>

        <div
          style={{
            height: "20%",
            width: "100%",
            backgroundColor: "dodgerblue",
          }}
        >
          Footer
        </div>
      </div>
    </>
  );
});
