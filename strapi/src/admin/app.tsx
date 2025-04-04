import type { StrapiApp } from "@strapi/strapi/admin";
import { lazy } from "react";

const PreviewProxy = lazy(() => import("./PreviewProxy"));

export default {
  config: {
    locales: ["en"],
  },
  register(app: StrapiApp) {
    app.router.addRoute({
      path: "preview-proxy",
      element: <PreviewProxy />,
    });
  },
};
