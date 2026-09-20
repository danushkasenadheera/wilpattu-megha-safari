export type TripType = "safari" | "stay" | "both";

/** Sets the booking form's trip type and scrolls to it. */
export function planTrip(type: TripType) {
  window.dispatchEvent(new CustomEvent("plan-trip", { detail: { type } }));
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
}
