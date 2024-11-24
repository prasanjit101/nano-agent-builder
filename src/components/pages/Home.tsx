'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { useCallback, useEffect, useState } from 'react';
import { Workflow } from '@/interfaces/workflow.dto';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Info, PanelRight, Play } from 'lucide-react';
import { ProcessWorkflowMessage, ScrapePageMessage } from '@/interfaces/chrome.dto';
import { getCurrentTab } from '@/extension/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Home() {
	// const [selectedWorkflow, setSelectedWorkflow] = useState<string>();
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [corpus, setCorpus] = useState<string>('');
	const [currWorkflow, setCurrWorkflow] = useState<Workflow>();
	const [currWorkflowName, setCurrentWorkflowName] = useState<string>('');
	const [currWorkflowId, setCurrentWorkflowId] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [sysMessage, setSysMessage] = useState<string>('');

	useEffect(() => {
		const savedWorkflows = localStorage.getItem('workflows');
		if (savedWorkflows) {
			const parsedWorkflows = JSON.parse(savedWorkflows);
			setWorkflows(parsedWorkflows);
		}
	}, []);

	useEffect(() => {
		if (currWorkflow) {
			setCurrentWorkflowName(currWorkflow.name);
			setCurrentWorkflowId(currWorkflow.id);
			console.log({ currWorkflow });
		}
	}, [currWorkflow]);

	const loadWorkflow = useCallback(
		(workflowId: string) => {
			const workflow = workflows.find((w) => w.id === workflowId);
			if (workflow) {
				setCurrWorkflow(workflow);
			}
		},
		[workflows]
	);

	const openSidePanel = () => {
		getCurrentTab({
			active: true,
			lastFocusedWindow: true,
			currentWindow: true,
			windowType: 'normal',
		}).then(async (a) => {
			console.log({ a });
			console.log(chrome.windows.WINDOW_ID_CURRENT);
			await chrome.sidePanel.open({ windowId: a?.windowId ?? chrome.windows.WINDOW_ID_CURRENT });
		});
	};

	const handleExecuteWorkflow = async () => {
		const tab = await getCurrentTab();
		const message: ProcessWorkflowMessage = {
			action: 'processWorkflow',
			body: {
				tab,
				extensionId: chrome.runtime.id,
				corpus,
				params: {
					temperature: 1,
					topK: 3,
				},
				currWorkflow,
			},
		};
		const port = chrome.runtime.connect({ name: 'run_workflow' });
		port.postMessage(message);
		// Listen for responses from the background script
		port.onMessage.addListener((message) => {
			if (message?.status === 'error') {
				setError(message.content);
				return;
			}
			setSysMessage(message.content);
		});
	};

	const loadPageContent = async () => {
		const tab = await getCurrentTab();
		const message: ScrapePageMessage = { action: 'scrapePage', body: { tab } };
		const port = chrome.runtime.connect({ name: 'scrape' });

		port.postMessage(message);

		// Listen for responses from the background script
		port.onMessage.addListener((message) => {
			console.log('Received from background:', message);
			if (message?.status === 'error') {
				setError(message.content);
				return;
			}
			setCorpus(message.content);
		});
		// setCorpus(JSON.stringify(lo));
	};

	return (
		<div className="p-4 font-semibold flex flex-col justify-center items-center">
			<Card className="max-w-64">
				<CardHeader className="text-center">
					<CardTitle>Nano Agent Builder</CardTitle>
					<p className="text-sm font-normal text-muted-foreground">{currWorkflowName}</p>
				</CardHeader>
				<CardContent className="max-w-64 flex flex-col items-center justify-center">
					<Select required value={currWorkflowId} onValueChange={loadWorkflow}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a workflow" />
						</SelectTrigger>
						<SelectContent>
							{workflows.map((workflow) => (
								<SelectItem key={workflow.id} value={workflow.id}>
									{workflow.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Separator orientation="vertical" className="h-5" />
					<Button
						variant={'secondary'}
						className="border border-primary"
						onClick={() => loadPageContent()}
					>
						{corpus ? 'Page loaded' : 'Load Page'}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="ml-2" />
								</TooltipTrigger>
								<TooltipContent className="w-64 h-20 overflow-y-scroll">
									<p className="text-xs text-muted-foreground">
										{corpus}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Button>
					<Separator orientation="vertical" className="h-7" />
					<Button size={'lg'} onClick={() => handleExecuteWorkflow()}>
						<Play className="mr-2" /> Run
					</Button>
					<Separator orientation="horizontal" className="my-7" />

					{error && <p className="text-xs text-red-500 my-3">{error}</p>}
					{sysMessage && (
						<p className="text-xs text-primary text-center my-3">{sysMessage}</p>
					)}

					<Button variant={'outline'} onClick={() => openSidePanel()} size={'sm'}>
						<PanelRight className="mr-2" />
						Open Sidepanel
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}