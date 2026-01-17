import { getRichTextBlocks } from "@/helpers/strapi/getRichTextBlocks";
import Link from "next/link";

export default function Footer({ siteSetting }: { siteSetting: any }) {
    
    const footerDescClasses = [
        "prose max-w-none", // prose class
        "prose-p:text-sm prose-p:m-0 prose-p:!leading-0 prose-p:text-base-content", // p class
        "prose-h2:text-xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:md:mt-16 prose-h2:mb-4 prose-h2:md:mb-8", // h2 class
        "prose-h3:text-lg prose-h3:md:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:md:mt-16 prose-h3:mb-4 prose-h3:md:mb-8", // h3 class
        "prose-ul:list-disc prose-ul:text-md prose-ul:md:text-xl prose-ul:ps-8 prose-ul:!leading-8 prose-ul:mb-4 prose-ul:md:mb-8 prose-ul:text-base-content ", // ul class
        "prose-li:m-0 prose-li:p-0", // li class
        "prose-a:link prose-a:link-primary"  // a class
    ].join(" ");


    return (
        <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded">
            <div>
                <ul className="menu menu-horizontal">
                    {siteSetting.attributes.quickLinks.map((link: any, index: number) => (
                        <li key={index}>
                            <Link href={link.url} className="link link-primary no-underline" target="_blank">{link.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={footerDescClasses}>
                { siteSetting.attributes.footerText.map((t: any, i: number) => getRichTextBlocks(t, {}, i)) }
            </div>
        </footer>
    );
}