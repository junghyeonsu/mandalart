import Logo from "../assets/logo.png";
import { ImageDownloadButton } from "./image-download-button";
import { ResetButton } from "./reset-button";
import { UrlCopyButton } from "./url-copy-button";

const Header = () => {
  return (
    <div className="flex items-center justify-between absolute top-0 left-0 z-50 w-full h-12 px-2 backdrop-blur-sm">
      <div>
        <img src={Logo} alt="logo" className="w-[24px] h-[24px]" />
      </div>
      <div className="flex gap-2">
        <ResetButton />
        <ImageDownloadButton />
        <UrlCopyButton />
      </div>
    </div>
  );
};

export { Header };
