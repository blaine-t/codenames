import TitleImage from "./titleImage";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <TitleImage />
      </div>
    </div>
  );
}
