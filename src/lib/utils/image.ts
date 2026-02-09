export function optimizedImageUrl(url: string, width = 1200, quality = 75): string {
	return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
