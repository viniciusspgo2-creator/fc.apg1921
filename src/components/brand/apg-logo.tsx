import { cn } from "@/lib/utils";

/* ============================================================
 * FC APG 1921 — official crest, redrawn as vector (brief §3.1/3.4)
 *
 * Geometry: elongated diamond shield (flat top, point down),
 * yellow rim + yellow field separated by a white hairline,
 * "APG" wordmark in blue with yellow outline and deep-blue flat
 * shadow, Portuguese flag triangle (green | red), classic
 * football with blue seams on a yellow ring at the tip.
 *
 * Variants: full (crest + ball) · icon (crest only)
 * Tones:    color (official palette) · mono (currentColor, dark bg)
 * Rules: never distort, never rotate beyond ±8°, keep 25%
 * clear space around the crest.
 * ============================================================ */

type APGLogoVariant = "full" | "icon";
type APGLogoTone = "color" | "mono";

export interface APGLogoProps {
  variant?: APGLogoVariant;
  tone?: APGLogoTone;
  className?: string;
  /** Accessible name. Pass "" to mark the logo decorative. */
  label?: string;
}

const SHIELD_OUTER = "M116 14 L396 14 L464 80 Q448 332 256 472 Q64 332 48 80 Z";
const SHIELD_INNER = "M136 38 L376 38 L436 98 Q422 322 256 442 Q90 322 74 98 Z";
const TRIANGLE_LEFT = "M162 268 L256 268 L256 424 Z";
const TRIANGLE_RIGHT = "M256 268 L350 268 L256 424 Z";
const TRIANGLE_OUTLINE = "M162 268 L350 268 L256 424 Z";
const BALL_PENTAGON =
  "M256 512 L282.6 531.3 L272.5 562.7 L239.5 562.7 L229.4 531.3 Z";
const BALL_SEAMS =
  "M256 512 Q254 494 252 479 " +
  "M282.6 531.3 Q306 522 330.2 527.9 " +
  "M272.5 562.7 Q288 590 301.9 615.1 " +
  "M239.5 562.7 Q224 590 210.1 615.1 " +
  "M229.4 531.3 Q206 522 181.8 527.9";

const C = {
  yellow: "#F8E010",
  blue: "#0052A8",
  blueDeep: "#002B5C",
  green: "#03A75E",
  red: "#DF0629",
  white: "#FFFFFF",
} as const;

function Wordmark({
  x,
  y,
  fill,
  stroke,
}: {
  x: number;
  y: number;
  fill: string;
  stroke?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text
        transform="skewX(-6)"
        x={0}
        y={0}
        textAnchor="middle"
        fontFamily="'Arial Black','Arial Bold',Arial,sans-serif"
        fontWeight={900}
        fontSize={132}
        textLength={252}
        lengthAdjust="spacingAndGlyphs"
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 8 : undefined}
        paintOrder={stroke ? "stroke" : undefined}
      >
        APG
      </text>
    </g>
  );
}

export function APGLogo({
  variant = "full",
  tone = "color",
  className,
  label = "FC APG 1921",
}: APGLogoProps) {
  const mono = tone === "mono";
  const line = mono ? "currentColor" : C.blue;

  return (
    <svg
      viewBox={variant === "full" ? "0 0 512 656" : "0 0 512 500"}
      className={cn("block", className)}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <title>{label}</title> : null}

      {/* Rim */}
      <path d={SHIELD_OUTER} fill={mono ? "currentColor" : C.yellow} />

      {/* Field, separated from the rim by a white hairline */}
      <path
        d={SHIELD_INNER}
        fill={mono ? "currentColor" : C.yellow}
        fillOpacity={mono ? 0.16 : 1}
        stroke={mono ? "currentColor" : C.white}
        strokeOpacity={mono ? 0.9 : 1}
        strokeWidth={5}
      />

      {/* Portuguese flag triangle */}
      {mono ? (
        <>
          <path d={TRIANGLE_LEFT} fill="currentColor" fillOpacity={0.8} />
          <path d={TRIANGLE_RIGHT} fill="currentColor" fillOpacity={0.45} />
        </>
      ) : (
        <>
          <path d={TRIANGLE_LEFT} fill={C.green} />
          <path d={TRIANGLE_RIGHT} fill={C.red} />
        </>
      )}
      <path
        d={TRIANGLE_OUTLINE}
        fill="none"
        stroke={mono ? "currentColor" : C.white}
        strokeWidth={6}
      />

      {/* Wordmark: deep-blue flat shadow, then blue letter with yellow outline */}
      {mono ? (
        <Wordmark x={256} y={205} fill="currentColor" />
      ) : (
        <>
          <Wordmark x={266} y={217} fill={C.blueDeep} />
          <Wordmark x={256} y={205} fill={C.blue} stroke={C.yellow} />
        </>
      )}

      {/* Football on its yellow ring, overlapping the shield tip */}
      {variant === "full" ? (
        <g>
          <circle
            cx={256}
            cy={552}
            r={92}
            fill={mono ? "currentColor" : C.yellow}
            fillOpacity={mono ? 0.28 : 1}
          />
          <circle
            cx={256}
            cy={552}
            r={78}
            fill={mono ? "currentColor" : C.white}
            fillOpacity={mono ? 0.1 : 1}
            stroke={line}
            strokeWidth={5}
          />
          <path
            d={BALL_PENTAGON}
            fill="none"
            stroke={line}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path
            d={BALL_SEAMS}
            fill="none"
            stroke={line}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </svg>
  );
}
