import logo from "../img/2.png";

export default function Img() {
  return (
    <div className="flex justify-center items-center p-4 mb-5 bg-gradient-to-r from-sky-300 via-sky-200 to-sky-400">
      <a href="https://nosdionisy.com/" target="_blank" rel="noopener noreferrer">
        <img
          src={logo}
          alt="Logo"
          className="max-w-full mt-10 h-[200px]"
        />
      </a>
    </div>
  );
}
