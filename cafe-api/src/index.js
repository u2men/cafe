/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const uploadMatch = url.pathname.match(/^\/api\/product\/([^/]+)\/upload$/);
		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			case '/api/products':
				const products = await env.CAFEDB.prepare("SELECT * FROM menu_items").all();
				return new Response(JSON.stringify(products.results), {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					 }
				});
			//       <article class="item" data-category="hot" data-name="caffe latte"><div class="item-image"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#latte"/></svg></div><div><h2>Caffe Latte</h2><p class="price">$4.50</p><p class="description">Espresso softened with velvety steamed milk.</p></div><button class="add" aria-label="Add Caffe Latte to order">+</button></article>
			// Upload product image endpoint with id
			// Example: PUT /api/product/1/upload
			case uploadMatch?.[0]:
				console.log('Upload product image request received');
				if (request.method === "OPTIONS") { 
					return new Response(null, {
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "PUT, OPTIONS",
							"Access-Control-Allow-Headers": "Content-Type"
						}
					});
				}

				if (request.method === 'PUT') {
					const formData = await request.formData();
					const file = formData.get('file');
					if (file) {
						const key = file.name;
						const id = uploadMatch[1];
						await env.CAFE_IMAGES.put(key, file.stream());
						await env.CAFEDB
							.prepare("UPDATE menu_items SET image_key = ? WHERE id = ?")
							.bind(key, id)
							.run();
						return new Response(JSON.stringify({ key }), {
							headers: {
								"Access-Control-Allow-Origin": "*",
								"Access-Control-Allow-Methods": "PUT, OPTIONS",
								"Access-Control-Allow-Headers": "Content-Type"							}
						});
					}
				}
				return new Response('Invalid request', { status: 400 });
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
};
