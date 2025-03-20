import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/images/60.png";

const Logo = () => {
  return (
    <Link href="/">
      <Image src={LogoImage} alt="Logo" width={120} height={40} />
    </Link>
  );
};

export default Logo;