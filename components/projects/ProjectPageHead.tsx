import { log } from "console";
import FadeInBottom from "../animation/FadeInBottom";
import { Heading } from "../visual";
import { getRichTextBlocks } from "@/helpers/strapi/getRichTextBlocks";
import { get } from "http";

async function getData() {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/project-page-setting?populate=*`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}

export default async function ProjectPageHead() {
  const { data } = await getData();
  const desc = data.attributes.desc.map((block: any, index: number) => {
    return getRichTextBlocks(block, {
      className: "text-md md:text-xl mb-4 md:mb-8 leading-8",
    }, index);
  });

  return (
    <FadeInBottom>
      <Heading
        topTitle={data.attributes.topTitle}
        leftTitle={data.attributes.leftTitle}
        rightTitle={data.attributes.rightTitle}
        colorReverse={true}
      />

      { desc }
    </FadeInBottom>
  );
}
