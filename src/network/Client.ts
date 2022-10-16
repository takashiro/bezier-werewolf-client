export type FetchApi = typeof window.fetch;

export default class Client {
	protected rootUrl: string;

	protected fetch: FetchApi;

	constructor(rootUrl: string, fetch: FetchApi) {
		this.rootUrl = rootUrl;
		this.fetch = fetch;
	}

	get(context: string, options?: RequestInit): Promise<Response> {
		return this.request('GET', context, options);
	}

	post(context: string, options?: RequestInit): Promise<Response> {
		return this.request('POST', context, options);
	}

	delete(context: string, options?: RequestInit): Promise<Response> {
		return this.request('DELETE', context, options);
	}

	request(method: string, context: string, options?: RequestInit): Promise<Response> {
		const url = `${this.rootUrl}/${context}`;
		const init: RequestInit = {
			...options,
			method,
		};
		return this.fetch(url, init);
	}
}
