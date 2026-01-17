import { Page, SectionContainer } from "@/components/basic";
import BgHeading from "@/components/visual/bgHeading";
import { getContents } from "@/helpers/strapi/getContent";
import type { Metadata, ResolvingMetadata } from 'next';
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const url = slug;

    const endpoint = `${process.env.STRAPI_URL}/api/pages?populate=*&filters[url][$eqi]=/${url}`;
    const { data } = await fetch(endpoint).then((res) => res.json())

    if (!data || !data[0] || !data[0].attributes?.pageTitle || !data[0].attributes?.metaDesc) return {
        title: "Jacky FAN",
        description: "I build websites and eat computer bugs 😉",
        openGraph: {
            title: "Jacky FAN",
            description: "I build websites and eat computer bugs 😉",
            siteName: 'Jacky FAN',
            locale: 'en_US',
            type: 'website',
        },
    };

    return {
        title: `${data[0].attributes.pageTitle} - Jacky FAN`,
        description: data[0].attributes.metaDesc,
        openGraph: {
            title: `${data[0].attributes.pageTitle} - Jacky FAN`,
            description: data[0].attributes.metaDesc,
            siteName: 'Jacky FAN',
            locale: 'en_US',
            type: 'website',
        },
    }
}

async function getData(url: string) {
    const res = await fetch(`${process.env.STRAPI_URL}/api/pages?populate=*&filters[url][$eqi]=/${url}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}


async function checkPageExist(params: { slug: string }) {

    if (!params?.slug) {
        redirect("/404");
    }

    const { data } = await getData(params.slug);

    if (data.length == 0) {
        revalidatePath(`/${params.slug}`);
        redirect("/404?from=" + params.slug);
    }
}

export default async function NormalPage ({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await checkPageExist({ slug });

    const { data } = await getData(slug);

    return (
        <>
            <Page>
                {getContents(data[0].attributes.Contents)}
            </Page>
            {data[0].attributes.enableBgHeading && <BgHeading title={data[0].attributes.pageTitle} />}
        </>

    );
}