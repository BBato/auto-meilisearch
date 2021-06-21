const protocolRegex = /(?:https?:\/\/)?(.+)/;

export const ensureHTTPS = url => {
  if (!url || url === '') return '';
  const rawUrl = url.match(protocolRegex)?.[1];
  if (!rawUrl) return '';
  return `https://${rawUrl}`;
};
