import { Workflow } from './workflow.dto';

export type ChromeMessage = ProcessWorkflowMessage | ScrapePageMessage;

export interface ProcessWorkflowMessage {
	action: 'processWorkflow';
	body: ProcessWorkflowBody;
}

export interface ScrapePageMessage {
	action: 'scrapePage';
	body: {
		tab: chrome.tabs.Tab;
	};
}

export interface ProcessWorkflowBody {
	extensionId: string;
	corpus: string;
	tab?: chrome.tabs.Tab;
	params: {
		temperature: number;
		topK: number;
	};
	currWorkflow: Workflow | undefined;
}

export interface SidePanelData {
	status: 'processing' | 'success' | 'error';
	message: string;
	error?: string;
}
