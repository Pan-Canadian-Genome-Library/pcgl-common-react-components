/// <reference types="@testing-library/jest-dom/vitest" />

declare module "*.svg";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const content: any;
  export default content;
}
