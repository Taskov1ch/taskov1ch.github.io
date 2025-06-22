export default async function handler(request, response) {
	const { anime_ids } = request.query;
	const token = process.env.ANIXART_TOKEN;

	if (!token) {
		return response.status(500).json({ error: "Anixart token not configured" });
	}

	if (!anime_ids) {
		return response.status(400).json({ error: "anime_ids query parameter is required" });
	}

	const idsToCheck = anime_ids.split(',').map(id => parseInt(id.trim(), 10));

	try {
		const anixartResponse = await fetch(`https://api.anixart.tv/profile/list/all/3/0?token=${token}`);

		if (!anixartResponse.ok) {
			throw new Error(`Anixart API responded with status: ${anixartResponse.status}`);
		}

		const data = await anixartResponse.json();

		if (data.code !== 0 || !Array.isArray(data.content)) {
			return response.status(500).json({ error: "Invalid data structure from Anixart API" });
		}

		const completedIds = new Set();
		data.content.forEach(item => {
			if (item.id) {
				completedIds.add(item.id);
			}
		});

		const result = {};
		idsToCheck.forEach(id => {
			result[id] = completedIds.has(id);
		});

		return response.status(200).json(result);

	} catch (error) {
		console.error('Error in anixart-completed-check handler:', error);
		return response.status(500).json({ error: 'Internal server error' });
	}
}