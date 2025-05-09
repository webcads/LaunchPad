const getPreviewPathname = (model, { locale, document }): string | null => {
  const { slug } = document;
  const prefix = `/${locale ?? "en"}`;

  switch (model) {
    case "api::page.page":
      if (slug === "homepage") {
        return prefix;
      }
      return `${prefix}/${slug}`;
    case "api::article.article":
      return `${prefix}/blog/${slug}`;
    case "api::product.product":
      return `${prefix}/products/${slug}`;
    case "api::product-page.product-page":
      return `${prefix}/products`;
    case "api::blog-page.blog-page":
      return `${prefix}/blog`;
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env("CLIENT_URL");

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    flags: {
      nps: env.bool("FLAG_NPS", true),
      promoteEE: env.bool("FLAG_PROMOTE_EE", true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [clientUrl, "'self'"],
        async handler(model, { documentId, locale, status }) {
          const document = await strapi.documents(model).findOne({
            documentId,
            fields: ["slug"],
          });

          const pathname = getPreviewPathname(model, { locale, document });

          // Disable preview if the pathname is not found
          if (!pathname) {
            return null;
          }

          const urlSearchParams = new URLSearchParams({
            secret: env("PREVIEW_SECRET"),
            pathname,
            status,
            documentId,
            // For highlighting
            clientUrl,
            kind: strapi.getModel(model).kind,
            model,
            locale,
          });

          // return `${clientUrl}/api/preview?${urlSearchParams}`;
          return `/admin/preview-proxy?${urlSearchParams}`;
        },
      },
    },
  };
};
