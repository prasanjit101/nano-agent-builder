import { stepFunctionalities, Workflow } from '../src/interfaces/workflow.dto';
const workflow: Workflow = {
	id: '1732313233990',
	name: 'write a cold email for a 1:1 call in linkedin',
	nodes: [
		{
			id: 'start',
			type: 'custom',
			data: {
				id: 'start',
				type: 'start',
				title: 'write a cold email for a 1:1 call in linkedin',
				prompt: '',
				options: '',
			},
			position: {
				x: 20,
				y: 80,
			},
			width: 160,
			height: 141,
			selected: false,
			dragging: false,
			positionAbsolute: {
				x: 20,
				y: 80,
			},
		},
		{
			id: 'end',
			type: 'custom',
			data: {
				id: 'end',
				type: 'end',
				title: 'END',
				options: '',
			},
			position: {
				x: 1220,
				y: 40,
			},
			width: 160,
			height: 112,
			selected: false,
			positionAbsolute: {
				x: 1220,
				y: 40,
			},
			dragging: false,
		},
		{
			id: 'step-3',
			type: 'custom',
			data: {
				id: 'step-3',
				type: 'custom',
				title: 'summarize LinkedIn profile',
				prompt: 'put emphasis on interest and professional aspect',
				options: 'summarize',
				promptPlaceholder: 'Custom summarization prompt',
			},
			position: {
				x: 240,
				y: 160,
			},
			width: 256,
			height: 314,
			selected: false,
			positionAbsolute: {
				x: 240,
				y: 160,
			},
			dragging: false,
		},
		{
			id: 'step-4',
			type: 'custom',
			data: {
				id: 'step-4',
				type: 'custom',
				title: 'filter non-IT people',
				prompt: 'if the person is related to software industry',
				options: 'filter',
				promptPlaceholder: 'Specify the condition that it will allow to pass',
			},
			position: {
				x: 560,
				y: 160,
			},
			width: 256,
			height: 314,
			selected: false,
			positionAbsolute: {
				x: 560,
				y: 160,
			},
			dragging: false,
		},
		{
			id: 'step-5',
			type: 'custom',
			data: {
				id: 'step-5',
				type: 'custom',
				title: '',
				prompt: 'Write a linkedIn message requesting a 1:1 meeting over zoom, to discuss collaboration opportunity',
				options: 'write',
				promptPlaceholder: 'Additional directions to write',
			},
			position: {
				x: 880,
				y: 120,
			},
			width: 256,
			height: 314,
			selected: false,
			positionAbsolute: {
				x: 880,
				y: 120,
			},
			dragging: false,
		},
	],
	edges: [
		{
			source: 'start',
			sourceHandle: null,
			target: 'step-3',
			targetHandle: null,
			id: 'reactflow__edge-start-step-3',
		},
		{
			source: 'step-3',
			sourceHandle: null,
			target: 'step-4',
			targetHandle: null,
			id: 'reactflow__edge-step-3-step-4',
		},
		{
			source: 'step-4',
			sourceHandle: null,
			target: 'step-5',
			targetHandle: null,
			id: 'reactflow__edge-step-4-step-5',
		},
		{
			source: 'step-5',
			sourceHandle: null,
			target: 'end',
			targetHandle: null,
			id: 'reactflow__edge-step-5-end',
		},
	],
};

async function main() {
	async function processWorkflow(graph: Workflow) {
		// Helper function to find a node by its ID
		function findNodeById(nodes: Workflow['nodes'], id: string) {
			return nodes.find((node) => node.id === id);
		}

		// Helper function to process a node
		async function processNode(node: Workflow['nodes'][number], result: string) {
			// Implement the logic to process each node based on its type and data
			console.log(`Processing node: ${node.data.title}`);
			// For demonstration, we'll just return the node's title
			return node.data.title;
		}

		// Start processing from the node next to "start" node
		let currentNodeId = graph.edges.find((edge) => edge.source === 'start')?.target;
		let result = '';

		while (currentNodeId && currentNodeId !== 'end') {
			// Find the current node
			const currentNode = findNodeById(graph.nodes, currentNodeId);
			if (!currentNode) {
				throw new Error(`Node with ID ${currentNodeId} not found`);
			}

			// Process the current node
			let outcome = await processNode(currentNode, result);
			if (currentNode.data.options === 'filter') {
				if (outcome !== 'yes') return 'The data is filtered out by the filter step';
			} else {
				result = outcome;
			}

			// Find the next node based on the edges
			const nextEdge = graph.edges.find((edge) => edge.source === currentNodeId);
			if (!nextEdge) {
				throw new Error(`No edge found for node with ID ${currentNodeId}`);
			}

			// Move to the next node
			currentNodeId = nextEdge.target;
		}

		return result;
	}

	const result = await processWorkflow(workflow);
	console.log(`Result from workflow: `, result);
}

main();
