/// <reference types="@testing-library/jest-dom/vitest" />

declare module "*.svg";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";

declare module "*.css" {
  const content: any;
  export default content;
}