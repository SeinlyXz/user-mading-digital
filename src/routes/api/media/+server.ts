import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch('https://mading-dashboard.krapyak.id/api/media');
	const data = await response.json();
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
