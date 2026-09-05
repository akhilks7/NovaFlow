type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "avatar-sm",
  md: "",
  lg: "avatar-lg",
};

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className={`avatar ${sizes[size]}`.trim()} aria-hidden="true">
      {initials}
    </span>
  );
}