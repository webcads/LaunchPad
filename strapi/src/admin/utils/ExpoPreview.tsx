import * as React from "react";
import { Flex } from "@strapi/design-system";

export const ExpoPreview = () => {
  const qrCodeSrc = React.useMemo(() => {
    const qrCodeUrl = new URL("https://qr.expo.dev/eas-update");
    qrCodeUrl.searchParams.append(
      "projectId",
      "4327bdd6-9794-49d7-9b95-6a5198afd339",
    );
    qrCodeUrl.searchParams.append("runtimeVersion", "1.0.0");
    qrCodeUrl.searchParams.append("channel", "default");
    return qrCodeUrl.toString();
  }, []);

  return (
    <Flex
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <img src={qrCodeSrc} alt="Expo QR Code" />
    </Flex>
  );
};
