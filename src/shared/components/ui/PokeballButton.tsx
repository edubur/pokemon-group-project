"use client";

const PokeballButton = ({ size = "h-24 w-24" }) => {
  return (
    <div
      className={`
        pokeball-button
        relative
        flex-shrink-0
        ${size}
        cursor-pointer
        overflow-hidden
        rounded-full
        border-2
        border-black
        bg-white
        transition-transform
        group-hover:animate-shake
        active:scale-95
        active:animate-none
      `}
    />
  );
};

export default PokeballButton;
