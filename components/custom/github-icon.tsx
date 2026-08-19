import Image from "next/image";

const GithubIcon = ({ height = 30, width = 30 }) => {
  return (
    <div>
      <Image
        src={"github-brands-solid.svg"}
        alt="github-icon"
        height={height}
        width={width}
      />
    </div>
  );
};

export default GithubIcon;
