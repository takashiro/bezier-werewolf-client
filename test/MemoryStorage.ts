import ClientStorage from '@karuta/rest-client/ClientStorage';

export default class MemoryStorage implements ClientStorage {
	protected readonly map = new Map<string, string>();

	get length(): number {
		return this.map.size;
	}

	clear(): void {
		this.map.clear();
	}

	getItem(key: string): string | null {
		return this.map.get(key) ?? null;
	}

	key(index: number): string | null {
		const keys = [...this.map.keys()];
		return keys[index] ?? null;
	}

	removeItem(key: string): void {
		this.map.delete(key);
	}

	setItem(key: string, value: string): void {
		this.map.set(key, value);
	}

	getApi(): Storage {
		return this;
	}
}
