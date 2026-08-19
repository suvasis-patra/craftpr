import Image from "next/image";

const CraftPrLogo = ({ height = 30, width = 30 }) => {
  return (
    <div>
      <Image
        src={"craftpr_logo.svg"}
        alt="craftpr"
        height={height}
        width={width}
      />
    </div>
  );
};

export default CraftPrLogo;
