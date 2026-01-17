import { Page } from '@/components/basic'
import { getContents } from '@/helpers/strapi/getContent'
import { revalidatePath } from 'next/cache'
import { redirect, notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const endpoint = `${process.env.STRAPI_URL}/api/pages?populate=*&filters[url][$eqi]=/`;
    const response = await fetch(endpoint, { next: { revalidate: 3600 } });
    
    if (!response.ok) throw new Error("Failed to fetch metadata");
    
    const { data } = await response.json();

    if (!data?.[0]?.attributes?.pageTitle || !data[0].attributes?.metaDesc) {
      return {
        title: "Jacky FAN - Frontend Developer in Hong Kong",
        description: "I build websites and eat computer bugs 😉",
      };
    }

    return {
      title: `Jacky FAN - Frontend Developer in Hong Kong`,
      description: data[0].attributes.metaDesc,
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Jacky FAN - Frontend Developer in Hong Kong",
      description: "I build websites and eat computer bugs 😉",
    };
  }
}

async function getData() {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/pages?populate[0]=Contents&populate[1]=Contents.techs&populate[2]=Contents.techs.icon&filters[url][$eqi]=/`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch page data");
  }

  return res.json();
}

export default async function Home() {
  try {
    const { data } = await getData();

    if (!data || data.length === 0) {
      notFound();
    }

    return (
      <Page reserveNavbarHeight={false}>
        {getContents(data[0].attributes.Contents)}
      </Page>
    )
  } catch (error) {
    console.error("Error rendering home page:", error);
    notFound();
  }
}