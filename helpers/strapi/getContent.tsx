import FadeInBottom from "@/components/animation/FadeInBottom";
import { getRichTextBlocks } from "./getRichTextBlocks";
import { Heading } from "@/components/visual";
import Link from "next/link";
import { ActiveLink, SectionContainer } from "@/components/basic";
import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import { ProjectGrid } from "@/components/home/projects";
import { ContactForm, Letter3D } from "@/components/home";
import { AboutMeSection, HeroSection } from "@/components/home/sections";
import type { PageContentType } from "@/interfaces/ContentBlockProps";

function getContents(data: PageContentType[] | null | undefined) {
    if (!data || !Array.isArray(data)) return null;

    return data.map((block: PageContentType, i: number) => {
        switch (block.__component) {
            case "page.page-rich-text": {
                const classes = [
                    "prose max-w-none",
                    "prose-p:text-md prose-p:md:text-xl prose-p:md:8 prose-p:!leading-8 prose-p:text-base-content",
                    "prose-h2:text-xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:md:mt-16 prose-h2:mb-4 prose-h2:md:mb-8",
                    "prose-h3:text-lg prose-h3:md:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:md:mt-16 prose-h3:mb-4 prose-h3:md:mb-8",
                    "prose-ul:list-disc prose-ul:text-md prose-ul:md:text-xl prose-ul:ps-8 prose-ul:!leading-8 prose-ul:mb-4 prose-ul:md:mb-8 prose-ul:text-base-content",
                    "prose-li:m-0 prose-li:p-0",
                    "prose-a:link prose-a:link-primary"
                ].join(" ");

                return (
                    <SectionContainer key={i}>
                        <FadeInBottom>
                            <div className={classes}>
                                {block.content.map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                            </div>
                        </FadeInBottom>
                    </SectionContainer>
                );
            }

            case "page.page-heading":
                return (
                    <SectionContainer bottomSpacing={false} key={i}>
                        <FadeInBottom>
                            <Heading 
                                topTitle={block.topTitle} 
                                leftTitle={block.leftTitle} 
                                rightTitle={block.rightTitle} 
                                colorReverse={block.colorReverse}
                            />
                        </FadeInBottom>
                    </SectionContainer>
                );

            case "page.button": {
                const buttonContent = (
                    <>
                        {block.name}
                        <ArrowSmallDownIcon className="h-6 w-6 text-content -rotate-90" />
                    </>
                );

                if (block.external) {
                    return (
                        <SectionContainer topSpacing={false} bottomSpacing={false} key={i}>
                            <FadeInBottom>
                                <Link href={block.url} className="btn btn-neutral">
                                    {buttonContent}
                                </Link>
                            </FadeInBottom>
                        </SectionContainer>
                    );
                }
                return (
                    <SectionContainer key={i}>
                        <FadeInBottom>
                            <ActiveLink href={block.url} className="btn btn-neutral">
                                {buttonContent}
                            </ActiveLink>
                        </FadeInBottom>
                    </SectionContainer>
                );
            }

            case "page.project-grid":
                return <ProjectGrid key={i} />;

            case "page.contact-form":
                return (
                    <SectionContainer key={i}>
                        <FadeInBottom>
                            <p className="font-bold text-xl md:text-3xl mt-8 md:mt-16 mb-4 md:mb-8">
                                {block.title}
                            </p>
                            <div className="card w-full bg-base-300 shadow-xl">
                                <div className="card-body">
                                    <ContactForm />
                                </div>
                            </div>
                        </FadeInBottom>
                    </SectionContainer>
                );

            case "page.3-d-letter":
                return block.enable ? <Letter3D key={i} /> : null;

            case "page.hero-section":
                return (
                    <HeroSection 
                        title={block.title} 
                        desc={block.desc} 
                        arrowText={block.arrowText} 
                        arrowLink={block.arrowLink} 
                        key={i}
                    />
                );

            case "page.about-me-section":
                return (
                    <AboutMeSection
                        topTitle={block.topTitle}
                        leftTitle={block.leftTitle}
                        rightTitle={block.rightTitle}
                        contents={block.contents.map((c: any, idx: number) => getRichTextBlocks(c, {}, idx))}
                        techs={block.techs}
                        btnLinks={block.btnLinks}
                        btnText={block.btnText}
                        key={i}
                    />
                );

            default:
                return null;
        }
    });
}

export { getContents };