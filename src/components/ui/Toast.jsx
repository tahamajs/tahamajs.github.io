// src/components/ui/Toast.jsx
export default function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast-wrap">
      <div className="toast">{msg}</div>
    </div>
  );
}
