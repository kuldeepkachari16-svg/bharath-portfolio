import data from "@/content/portfolio.json";
export type PortfolioImage = {
  src: string;
  source: string;
  width: number;
  height: number;
};
export type Block =
  | { type: "text"; html: string }
  | { type: "images"; images: PortfolioImage[] }
  | { type: "video"; src: string };
export type Project = {
  slug: string;
  title: string;
  year: string;
  cover: PortfolioImage;
  coverHover?: PortfolioImage;
  collection: string;
  blocks: Block[];
};
export const portfolio = data;
export const projects = data.projects as Project[];
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const getCollection = (slug: string) =>
  data.collections.find((c) => c.slug === slug);
export const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
