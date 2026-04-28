import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "Marxvest Real Estate social preview showing a premium gated estate entrance and verified land buying support in Nigeria.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function readImageDataUri(relativePath: string) {
  const filePath = join(process.cwd(), "public", relativePath);
  const buffer = await readFile(filePath);
  const extension = relativePath.split(".").pop()?.toLowerCase();

  let mimeType = "image/png";

  if (extension === "webp") {
    mimeType = "image/webp";
  } else if (extension === "jpg" || extension === "jpeg") {
    mimeType = "image/jpeg";
  }

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export default async function Image() {
  const backgroundImage = await readImageDataUri("images/gate-house-2.webp");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#081B4B",
          color: "#FFFFFF",
          fontFamily:
            '"Inter", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <img
          src={backgroundImage}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(5,17,52,0.96) 0%, rgba(5,17,52,0.88) 34%, rgba(5,17,52,0.45) 64%, rgba(5,17,52,0.18) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(6,18,52,0.22) 0%, rgba(6,18,52,0.05) 52%, rgba(6,18,52,0.54) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 60px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#E5D0A6",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  color: "#E5D0A6",
                }}
              >
                Marxvest Real Estate
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.74)",
                }}
              >
                Documentation-first land acquisition
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: -3.2,
              }}
            >
              <span>Buy Verified Land</span>
              <span>in Nigeria With</span>
              <span style={{ color: "#E5D0A6" }}>Confidence</span>
            </div>

            <div
              style={{
                fontSize: 27,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.86)",
                maxWidth: 700,
              }}
            >
              Inspected estates, guided documentation, flexible payment
              support, and clearer next steps for buyers.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflow: "hidden",
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(8,27,75,0.38)",
              width: "100%",
              maxWidth: 920,
            }}
          >
            {[
              "CAC Registered",
              "Verified Titles",
              "100+ Buyers",
              "Transparent Pricing",
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "18px 22px",
                  borderLeft:
                    index === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: index === 0 ? "#E5D0A6" : "rgba(255,255,255,0.92)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
