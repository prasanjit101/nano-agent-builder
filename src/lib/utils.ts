import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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