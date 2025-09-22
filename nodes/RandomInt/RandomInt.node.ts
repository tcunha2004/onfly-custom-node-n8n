import type { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class RandomInt implements INodeType {
	description: INodeTypeDescription = {
		// Como o node aparece no editor
		displayName: 'Random',
		name: 'randomInt',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'Gerador de número aleatório utilizando Random.org',
		defaults: { name: 'Random' },
		inputs: ['main'],
		outputs: ['main'],

		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'trueRng',
				options: [
					{
						name: 'True Random Number Generator',
						value: 'trueRng',
						description: 'Gere um número aleatório via Random.org',
					},
				],
			},
			{
				displayName: 'Min',
				name: 'min',
				type: 'number',
				typeOptions: { minValue: Number.MIN_SAFE_INTEGER },
				default: 1,
				required: true,
				description: 'Inteiro Mínimo (inclusive)',
				displayOptions: { show: { operation: ['trueRng'] } },
			},
			{
				displayName: 'Max',
				name: 'max',
				type: 'number',
				typeOptions: { maxValue: Number.MAX_SAFE_INTEGER },
				default: 100,
				required: true,
				description: 'Inteiro Máximo (inclusive)',
				displayOptions: { show: { operation: ['trueRng'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			if (operation !== 'trueRng') continue;

			const min = this.getNodeParameter('min', i) as number;
			const max = this.getNodeParameter('max', i) as number;

			if (!Number.isInteger(min) || !Number.isInteger(max)) {
				throw new Error('Min and Max devem ser inteiros.');
			}
			if (min > max) {
				throw new Error('Min não pode ser maior que Max.');
			}

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: 'https://www.random.org/integers/',
				qs: {
					num: 1,
					min,
					max,
					col: 1,
					base: 10,
					format: 'plain',
					rnd: 'new',
				},
			});

			const valor = parseInt(String(response).trim(), 10);
			if (!Number.isInteger(valor)) {
				throw new Error('Resposta inesperada de random.org.');
			}

			returnData.push({
				json: {
					operation: 'True Random Number Generator',
					min,
					max,
					valor,
					provedor: 'random.org',
				},
			});
		}

		return [returnData];
	}
}
