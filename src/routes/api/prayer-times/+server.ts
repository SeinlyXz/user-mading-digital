import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch(
		'https://api.aladhan.com/v1/timingsByCity?city=Yogyakarta&country=Indonesia&method=20'
	);
	const result = await response.json();
	return new Response(JSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
};
