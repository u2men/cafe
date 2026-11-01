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
		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			case '/api/products':
				return new Response(JSON.stringify([
					{
						name: "Caffe Latte",
						category: "hot",
						price: "$4.50",
						description: "Espresso softened with velvety steamed milk."
					},
					{
						name: "Iced Coffee",
						category: "cold",
						price: "$3.50",
						description: "Chilled coffee served over ice."
					},
					{
						name: "Cappuccino",
						category: "hot",
						price: "$4.00",
						description: "Espresso with steamed milk and a layer of foam."
					},
					{
						name: "Mocha",
						category: "hot",
						price: "$4.75",
						description: "Espresso with chocolate and steamed milk."
					}
				]), {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					 }
				});
			//       <article class="item" data-category="hot" data-name="caffe latte"><div class="item-image"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#latte"/></svg></div><div><h2>Caffe Latte</h2><p class="price">$4.50</p><p class="description">Espresso softened with velvety steamed milk.</p></div><button class="add" aria-label="Add Caffe Latte to order">+</button></article>

			default:
				return new Response('Not Found', { status: 404 });
		}
	},
};
