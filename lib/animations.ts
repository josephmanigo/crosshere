import type { Variants, Transition } from "framer-motion";

// ── Spring Presets ──────────────────────────────────────────────────────────
export const spring = {
  gentle: { type: "spring", stiffness: 120, damping: 20 } as Transition,
  snappy: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 15 } as Transition,
};

// ── Easing Presets ──────────────────────────────────────────────────────────
export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

// ── Fade Variants ───────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: ease.out },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: ease.out },
  },
};

// ── Scale Variants ──────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

// ── Slide Variants ──────────────────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

// ── Stagger Container ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
};

// ── Page Transition ─────────────────────────────────────────────────────────
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15 },
  },
};

// ── Hover Presets ───────────────────────────────────────────────────────────
export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2, ease: ease.out } },
  whileTap: { y: 0, scale: 0.98 },
};

export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: ease.out } },
  whileTap: { scale: 0.98 },
};

// ── Notification ────────────────────────────────────────────────────────────
export const notificationVariants: Variants = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: spring.snappy,
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// ── Student Mobile Animations ───────────────────────────────────────────
export const sheetSlideUp: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.25, ease: ease.smooth },
  },
};

export const floatIn: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

export const cardSlideLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.2, ease: ease.smooth },
  },
};

export const cardSlideRight: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: { duration: 0.2, ease: ease.smooth },
  },
};

export const emergencyPulse = {
  scale: [1, 1.04, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
};

export const breatheAnimation = {
  scale: [1, 1.02, 1],
  opacity: [1, 0.9, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

export const mobilePageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
};

