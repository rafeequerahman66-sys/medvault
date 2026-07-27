import StoreFront from "./components/StoreFront";

/* Root site (/) now serves the approved MedVault redesign.
   Backend, APIs, order flow (/api/orders + WhatsApp) are untouched. */
export default function Page() {
  return <StoreFront />;
}
