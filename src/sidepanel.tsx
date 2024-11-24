import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SidePanelData } from './interfaces/chrome.dto';
import { getCurrentTab, getStorage } from './extension/utils';
import { Badge } from '@/components/ui/badge';
import { marked } from 'marked';

const SidePanel: React.FC = () => {
	const [sidePanelData, setSidePanelData] = useState<SidePanelData>({
		message: 'Nothing to show here',
		status: 'processing',
	});
	const [tabId, setTabId] = useState<number | null | undefined>();
	const [markdown, setMarkdown] = useState('No content loaded');

	useEffect(() => {
		getCurrentTab().then((tab) => {
			const t = tab ? tab.id : null;
			setTabId(t);
			getStorage<SidePanelData>('sidePanelData').then((result) => {
				setSidePanelData(result);
				setMarkdown(result.message);
			});
		});
	}, []);

	return (
		<div className="p-4 space-y-4 overflow-auto">
			<div className="flex items-center gap-2">
				<h1 className="text-xl font-semibold">Side Panel</h1>
				<Badge variant={'outline'}>{sidePanelData.status}</Badge>
			</div>
			<div
				className="text-sm border p-2 rounded text-wrap"
				dangerouslySetInnerHTML={{ __html: marked(markdown) }}
			></div>
			{sidePanelData.error && (
				<>
					<p className="font-semibold">Error detected</p>
					<p className="text-sm border p-2 rounded text-red-500 text-wrap">
						{sidePanelData.error}
					</p>
				</>
			)}
			<p>Tab ID: {tabId}</p>
		</div>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SidePanel />
	</React.StrictMode>
);
