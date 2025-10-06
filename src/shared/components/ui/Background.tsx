"use client";

export default function Background() {
  return (
    <>
      {/* Background image */}
      <div
        className="fixed inset-0 z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/background.png")',
          filter: "blur(20px)",
          transform: "scale(1.05)",
        }}
      ></div>

      {/* Semi transparent black overlay */}
      <div className="fixed inset-0 z-20 bg-black opacity-60"></div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br via-yellow-500/10 opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tl via-orange-500/10 opacity-50"></div>
      </div>
    </>
  );
}
