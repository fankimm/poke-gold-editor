import { useRef, useState } from "react";
type Data = {
  money: number;
  trainerId: number;
  timePlayed: string;
  itemPocketItemList: {
    name: string;
    count: number;
  }[];
};
export default function Home() {
  const [data, setData] = useState<Data | undefined>();
  const uploadRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div
        ref={uploadRef}
        style={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "5px",
        }}
      >
        <h3>파일 업로드</h3>
        <input
          type={"file"}
          multiple={false}
          style={
            {
              // display: 'none'
            }
          }
          onChange={async (e) => {
            if (e.target.files && e.target.files.length > 0) {
              const formData = new FormData();
              formData.append("file", e.target.files[0]);
              const res = fetch("api/handleFiles", {
                method: "POST",
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((res) => {
                  console.log(res);
                  setData(res);
                });
            }
          }}
        />
      </div>
      {data && (
        <>
          <div>{`소지금액 : ${data.money}`}</div>
          <div>{`트레이너아이디 : ${data.trainerId}`}</div>
          <div>{`플레이시간 : ${data.timePlayed}`}</div>
          {data.itemPocketItemList.map((i) => {
            return (
              <div
                key={i.name}
                style={{
                  border: "1px solid black",
                  borderRadius: "5px",
                  margin: "4px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>이름 : {i.name}</div>
                <div>갯수 : {i.count}</div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
