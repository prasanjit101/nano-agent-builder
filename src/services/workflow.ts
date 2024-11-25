import { invokeAi } from '@/extension/utils';
import { Workflow } from '@/interfaces/workflow.dto';
import { stepFunctionalities } from '@/lib/utils';

export const runWorkflow = async ({
	workflow,
	corpus,
	port,
}: {
	workflow?: Workflow;
	corpus: string;
	port: chrome.runtime.Port;
}): Promise<{
	result?: string;
	error?: string;
}> => {
	try {
		if (!workflow) {
			throw new Error('Workflow not found');
		}

		//  TODO: add new workflow processing with non-linear workflow processing capabilities
		async function processWorkflow(graph: Workflow) {
			// Helper function to find a node by its ID
			function findNodeById(nodes: Workflow['nodes'], id: string) {
				return nodes.find((node) => node.id === id);
			}

			// Helper function to process a node
			async function processNode(node: Workflow['nodes'][number], context: string) {
				// Implement the logic to process each node based on its type and data
				const stepType = stepFunctionalities.find((s) => s.value === node.data.options);

				try {
					port.postMessage({
						content: `Processing ${node.data.title ?? ''}`,
					});
				} catch (error) {}

				if (stepType) {
					const result = await invokeAi(corpus, [
						{
							role: 'system',
							content: stepType.sysPrompt,
						},
						{
							role: 'user',
							content: `Here is additional context that might be useful: \n${context}`,
						},
						{
							role: 'user',
							content: stepType.placeholder + (node.data.prompt ?? ''),
						},
						{
							role: 'user',
							content: `Note. Only output the response in supported languages or english by default`,
							// to prevent nano AI from throwing error "The model attempted to output text in an untested language, and was prevented from doing so."
						},
					]);
					return result;
				} else {
					console.error('Step type not found', node.data);
					return '';
				}
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
		return {
			result,
		};
	} catch (error) {
		console.error(error);
		return { error: (error as Error).message };
	}
};
