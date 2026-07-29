// app/loading.tsx
import CinnabloomSpinner from "./components/CinnabloomSpinner";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <CinnabloomSpinner fullScreen label="Warming up the oven..." />
    </div>
  );
}