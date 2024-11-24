import { Node, Edge } from 'reactflow';

type StepActions = {
	onChange: (
		id: string,
		field: 'prompt' | 'options' | 'title' | 'promptPlaceholder',
		value: string | string[]
	) => void;
	onDelete: (id: string) => void;
};

type StepState = {
	id: string;
	type: 'start' | 'end' | 'custom';
	title: string;
	promptPlaceholder?: string;
	prompt?: string;
	options: string;
};

export type Step = StepState & StepActions;

export interface Workflow {
	id: string;
	name: string;
	nodes: Node<StepState>[];
	edges: Edge[];
}