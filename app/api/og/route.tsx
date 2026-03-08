import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get("title") || "SalamiPay"
  const target = searchParams.get("target") || "0"
  const collected = searchParams.get("collected") || "0"
  const contributors = searchParams.get("contributors") || "0"

  const targetNum = Number(target)
  const collectedNum = Number(collected)
  const progress = targetNum > 0 ? Math.min((collectedNum / targetNum) * 100, 100) : 0

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #065f46 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            S
          </div>
          <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
            SalamiPay
          </span>
        </div>

        {/* Event title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.2,
            marginBottom: "32px",
          }}
        >
          {title}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "60%",
            height: "24px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            overflow: "hidden",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #34d399, #6ee7b7)",
            }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "48px", color: "rgba(255,255,255,0.9)", fontSize: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "#6ee7b7" }}>
              {Math.round(progress)}%
            </span>
            <span>Funded</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
              {Number(target).toLocaleString()}
            </span>
            <span>Target</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
              {contributors}
            </span>
            <span>Contributors</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          salamipay.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
