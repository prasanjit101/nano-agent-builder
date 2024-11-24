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

export const stepFunctionalities = [
	{
		label: 'Summarize',
		value: 'summarize',
		placeholder: 'Additional directions :',
		sysPrompt: `You are a very intelligent AI. Your goal is to summarise the content given by the user. Retain only the important details.`,
	},
	{
		label: 'Write',
		value: 'write',
		placeholder: 'What to write :',
		sysPrompt: `You are an expert writer. Your goal is to write the best quality content for the user.`,
	},
	{
		label: 'Categorize',
		value: 'categorize',
		placeholder: 'Items to categorize into :',
		sysPrompt: `You are a very intelligent AI. Your goal is to categorize into the categories asked by the user.`,
	},
	{
		label: 'Translate',
		value: 'translate',
		placeholder: 'Translate to :',
		sysPrompt: `You are an expert translator. Your goal is to translate the content given by the user into the language asked by the user.`,
	},
	{
		label: 'Sentiment Analysis',
		value: 'sentiment_analysis',
		placeholder: 'Mention the condition & sentiments. Eg. Critisizing - When input is negative',
		sysPrompt: `You are an expert sentiment analyzer. Your goal is to analyze the sentiments of the content given by the user into the following conditions.`,
	},
	{
		label: 'Custom AI call',
		value: 'custom',
		placeholder: 'Enter a custom prompt to custom process the data',
		sysPrompt: `You are a very intelligent AI`,
	},
	{
		label: 'Filter',
		value: 'filter',
		placeholder: 'The conditions that it will allow to pass :',
		sysPrompt: `Your goal is to reply with 'yes' when the following conditions are met. If the conditions are not met, reply with 'no'`,
	},
];