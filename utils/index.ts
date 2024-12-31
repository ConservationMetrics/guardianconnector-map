export const getFilePathsWithExtension = (
  feature: { [key: string]: unknown },
  allExtensions: { [category: string]: string[] },
): string[] => {
  if (!feature) return [];

  const filePaths: string[] = [];
  Object.keys(feature).forEach((key) => {
    if (typeof feature[key] !== "string") return;
    if (feature[key].includes("attachment")) return;

    const files = feature[key].split(",");

    files.forEach((file: string) => {
      const hasValidExtension = Object.values(allExtensions).some(
        (extensions) =>
          extensions.some((ext: string) => file.trim().endsWith(ext)),
      );

      if (hasValidExtension) {
        const cleanedFile = file
          .trim()
          .replace(/ /g, "_")
          .replace(/^\['|'\]$/g, "");

        filePaths.push(cleanedFile);
      }
    });
  });
  return filePaths;
};

export const toCamelCase = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/_([a-z0-9])/g, (_, p1) => p1.toUpperCase())
    .replace(/(^\w)/, (match) => match.toLowerCase());
};
