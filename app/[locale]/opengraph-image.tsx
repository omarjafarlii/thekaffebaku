import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { info } from "@/data/info";

/** Open Graph image (1200×630): the café's own exterior photo + original badge. */
export const alt = `${info.fullName} — ${info.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toDataUrl = async (p: string) =>
  `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", p))).toString("base64")}`;

export default async function OgImage() {
  const [photo, badge] = await Promise.all([
    toDataUrl("media/interior.jpg"),
    toDataUrl("brand/profile.jpg"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#2c4236",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        width={480}
        height={630}
        style={{ objectFit: "cover" }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          color: "#fbf9f4",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badge}
          alt=""
          width={120}
          height={120}
          style={{ borderRadius: 999 }}
        />
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            marginTop: 36,
            lineHeight: 1.05,
          }}
        >
          {info.fullName}
        </div>
        <div style={{ fontSize: 34, marginTop: 16, color: "#d6a066" }}>
          {info.slogan}
        </div>
        <div style={{ fontSize: 24, marginTop: 36, color: "#e6ece4" }}>
          ★ 4.9 Google · Icherisheher, Baku
        </div>
      </div>
    </div>,
    size,
  );
}
