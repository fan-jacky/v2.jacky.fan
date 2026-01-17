import FadeInBottom from "@/components/animation/FadeInBottom";
import { ActiveLink, Page, SectionContainer } from "@/components/basic";
import { Heading } from "@/components/visual";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import { LinkIcon } from "@heroicons/react/24/outline";
import BgHeading from "@/components/visual/bgHeading";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const STRAPI_URL = process.env.STRAPI_URL;

export async function generateMetadata( { params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const alias = slug;

    if (!STRAPI_URL) {
        return {
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
    }
  
    const endpoint = `${STRAPI_URL}/api/projects?populate=*&filters[alias][$eqi]=${alias}`;
  const { data } = await fetch(endpoint).then((res) => res.json())

  if (!data || !data[0] || !data[0].attributes?.title) return {
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
    title: `${data[0].attributes.title} - Jacky FAN`,
    description: data[0].attributes.desc ?? "",
    openGraph: {
        title: `${data[0].attributes.title} - Jacky FAN`,
        description: data[0].attributes.desc ?? "",
        siteName: 'Jacky FAN',
        locale: 'en_US',
        type: 'website',
    },
  }
}

async function getData(alias: string) {
    if (!STRAPI_URL) {
        return { data: [] } as any;
    }

    const res = await fetch(`${STRAPI_URL}/api/projects?populate=*&filters[alias][$eqi]=${alias}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function ProjectDescPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const alias = slug;

    if (!STRAPI_URL) {
        return (
            <Page>
                <SectionContainer>
                    <p className="text-lg md:text-xl">Content API not configured. Set STRAPI_URL to load this project.</p>
                </SectionContainer>
            </Page>
        );
    }

    const { data } = await getData(alias);

    if (!data || data.length == 0) {
        return <div className="min-h-screen w-screen flex flex-col gap-4 items-center justify-center">
        <p className="text-xl md:text-2xl w-fit">😵 Project Not Found 😵</p>
        <Link href="/" className="btn">Back to Home Page</Link>
    </div>;
    }

    const { title, date, desc, tags, img, links, Contents } = data[0].attributes;

    return (
        <>
            <Page>
                <SectionContainer extendRightSpacing={true} extraClassName="bg-base-300 -mt-1 z-40 py-12 md:py-6" topSpacing={false}>
                    <FadeInBottom>
                        <div className="mb-4 md:mb-8">
                            <ActiveLink href="/projects" className="btn btn-outline w-fit">
                                <ArrowLeftIcon className="h-[1em]" />
                                Back
                            </ActiveLink>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-x-4 gap-y-8">
                            <div className="w-full xl:w-2/5">
                                <Heading topTitle="My Project" leftTitle={title} />
                                <div className="flex flex-row flex-wrap gap-2 mb-4 xl:mb-8">
                                    {tags.map((tag: any, i: number) => <div className="badge badge-lg badge-primary badge-outline" key={i}>{tag}</div>)}
                                </div>
                                <p className="mb-4 xl:mb-8">
                                    {desc}
                                </p>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {links.map((link: any, i: number) => <Link href={link.links} target="_blank" className={`btn ${i == 0 ? "btn-primary" : i == 1 ? "btn-secondary" : "btn-outline"}`} key={i}>
                                        <LinkIcon className="h-[1em]" />
                                        {link.name}
                                    </Link>)}
                                </div>

                            </div>
                            <div className="w-full xl:w-3/5">
                                <figure className="block aspect-video border-red-400 border-1 rounded-2xl bg-base-content relative">
                                    <Image
                                        src={`${process.env.STRAPI_URL}${img.data.attributes.url}`}
                                        fill={true}
                                        alt={title}
                                        className="object-contain p-2"
                                    />
                                </figure>
                            </div>
                        </div>
                    </FadeInBottom>
                </SectionContainer>

                <Tabs data={Contents} />

            </Page>
            <BgHeading title={title} />
        </>
    );
}