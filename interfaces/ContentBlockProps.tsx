/**
 * Content block types from Strapi
 */

export type PageContentType = 
  | PageRichTextBlock
  | PageHeadingBlock
  | PageButtonBlock
  | PageProjectGridBlock
  | PageContactFormBlock
  | Page3DLetterBlock
  | PageHeroSectionBlock
  | PageAboutMeSectionBlock;

export interface PageRichTextBlock {
  __component: 'page.page-rich-text';
  content: any[];
}

export interface PageHeadingBlock {
  __component: 'page.page-heading';
  topTitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  colorReverse?: boolean;
}

export interface PageButtonBlock {
  __component: 'page.button';
  name: string;
  url: string;
  external: boolean;
}

export interface PageProjectGridBlock {
  __component: 'page.project-grid';
}

export interface PageContactFormBlock {
  __component: 'page.contact-form';
  title: string;
}

export interface Page3DLetterBlock {
  __component: 'page.3-d-letter';
  enable: boolean;
}

export interface PageHeroSectionBlock {
  __component: 'page.hero-section';
  title: string;
  desc: string;
  arrowText: string;
  arrowLink: string;
}

export interface PageAboutMeSectionBlock {
  __component: 'page.about-me-section';
  topTitle: string;
  leftTitle: string;
  rightTitle: string;
  contents: any[];
  techs: any[];
  btnLinks: any[];
  btnText: string;
}
