import type { MetadataRoute } from 'next'

const STRAPI_URL = process.env.STRAPI_URL;
const api = STRAPI_URL ? `${STRAPI_URL}/api/` : null;
const siteUrl = "https://jacky.fan";

async function getData(path: string) {
    if (!api) {
        return { data: [] } as any;
    }

    const res = await fetch(`${api}${path}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const json = await res.json();

    return json;
}

async function getPages () {
    let data = await getData("pages");

    return data.data.map((page: any) => {
        return {
            url: `${siteUrl}${page.attributes.url}`,
            lastModified: new Date(page.attributes.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.8,
        }
    });
}

async function getProjectPages () {
    let data = await getData("projects");

    return data.data.map((project: any) => {
        return {
            url: `${siteUrl}/projects/${project.attributes.alias}`,
            lastModified: new Date(project.attributes.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.8,
        }
    });
}
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!STRAPI_URL) {
        // Fallback minimal sitemap when content API is not configured
        return [{ url: siteUrl, changeFrequency: 'monthly', priority: 1 }];
    }

    const pages = await getPages();
    const projectPages = await getProjectPages();

    return [
        ...pages,
        ...projectPages,
    ]
}