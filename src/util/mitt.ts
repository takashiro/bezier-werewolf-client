import mitt from 'mitt';

type Mitt = typeof mitt.default;

export * from 'mitt';
export default (mitt as unknown as Mitt);
