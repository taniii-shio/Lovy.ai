// ===============================
// 共通型・フラグ定義
// ===============================

export interface TypeFlags {
  // MBTI
  E: number;  // Extraversion
  I: number;  // Introversion
  N: number;  // Intuition
  S: number;  // Sensing
  Fm: number; // Feeling (MBTI)
  Tm: number; // Thinking (MBTI)
  J: number;  // Judging
  Pm: number; // Perceiving

  // LoveType16
  L: number;   // Lead
  Fl: number;  // Follow
  C: number;   // Cuddly
  A: number;   // Accept
  R: number;   // Realistic
  Pl: number;  // Passionate
  O: number;   // Optimistic
  El: number;  // Earnest
}

// MBTIを0/1フラグに
export function parseMbti(mbti: string) {
  const upper = mbti.toUpperCase();
  const [c0, c1, c2, c3] = upper.split("");

  const E = c0 === "E" ? 1 : 0;
  const I = c0 === "I" ? 1 : 0;

  const S = c1 === "S" ? 1 : 0;
  const N = c1 === "N" ? 1 : 0;

  const Tm = c2 === "T" ? 1 : 0;
  const Fm = c2 === "F" ? 1 : 0;

  const J = c3 === "J" ? 1 : 0;
  const Pm = c3 === "P" ? 1 : 0;

  return { E, I, S, N, Tm, Fm, J, Pm };
}

// LoveType4文字を0/1フラグに
export function parseLoveType(loveType: string) {
  const upper = loveType.toUpperCase();
  const [c0, c1, c2, c3] = upper.split("");

  const L = c0 === "L" ? 1 : 0;
  const Fl = c0 === "F" ? 1 : 0;

  const C = c1 === "C" ? 1 : 0;
  const A = c1 === "A" ? 1 : 0;

  const R = c2 === "R" ? 1 : 0;
  const Pl = c2 === "P" ? 1 : 0;

  const O = c3 === "O" ? 1 : 0;
  const El = c3 === "E" ? 1 : 0;

  return { L, Fl, C, A, R, Pl, O, El };
}

// MBTI + LoveType → TypeFlags
export function getFlags(mbti: string, loveType: string): TypeFlags {
  const m = parseMbti(mbti);
  const l = parseLoveType(loveType);

  return {
    E: m.E,
    I: m.I,
    N: m.N,
    S: m.S,
    Fm: m.Fm,
    Tm: m.Tm,
    J: m.J,
    Pm: m.Pm,
    L: l.L,
    Fl: l.Fl,
    C: l.C,
    A: l.A,
    R: l.R,
    Pl: l.Pl,
    O: l.O,
    El: l.El,
  };
}
