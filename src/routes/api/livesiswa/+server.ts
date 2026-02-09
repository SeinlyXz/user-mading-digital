import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch('https://ma.krapyak.id/api/livesiswa.php');
	const data = await response.json();
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
