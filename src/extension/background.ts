import { ChromeMessage, SidePanelData } from '@/interfaces/chrome.dto';
import { setStorage } from './utils';
import { runWorkflow } from '@/services/workflow';

chrome.runtime.onConnect.addListener(function (port) {
	if (port.name === 'scrape') {
		port.onMessage.addListener(async (message: ChromeMessage, port: chrome.runtime.Port) => {
			console.group('scrape');
			if (message.action === 'scrapePage') {
				const { tab } = message.body;

				console.log(tab);
				// scrape page
				if (!tab?.id || !tab?.url?.startsWith('http')) {
					console.error('Tab not found for scraping');
					return;
				}

				const injection: any = await chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['./assets/scraper.js'],
				});

				console.log({ injection });

				try {
					port.postMessage({
						content: injection?.[0]?.result ?? 'Failed to scrape page content',
						status:
							injection?.[0]?.result &&
							injection?.[0]?.result !== 'Page cannot be parsed'
								? 'success'
								: 'error',
					});
				} catch (error) {}
			}
			console.groupEnd();
		});
	} else if (port.name === 'run_workflow') {
		port.onMessage.addListener(async (message: ChromeMessage, port: chrome.runtime.Port) => {
			console.group('run_workflow');
			console.log({ message, port });
			if (!(chrome as any).aiOriginTrial.languageModel) {
				port.postMessage({
					status: 'error',
					content: 'Chrome built-in AI not enabled in your browser. Check https://developer.chrome.com/docs/extensions/ai/prompt-api#add_support_to_localhost',
				});
				return;
			}

			if (message.action === 'processWorkflow') {
				// process workflow
				let sidePanelData: SidePanelData = {
					status: 'processing',
					message: `Processing ${message.body.tab?.url}`,
				};

				try {
					port.postMessage({
						content: `Processing workflow`,
					});
				} catch (error) {}

				await setStorage('sidePanelData', sidePanelData);

				const { result = '', error = '' } = await runWorkflow({
					workflow: message.body.currWorkflow,
					corpus: message.body.corpus,
					port,
				});

				if (result) {
					sidePanelData = {
						status: 'success',
						message: result,
						error,
					};
				} else {
					sidePanelData = {
						status: 'error',
						message: 'Something went wrong ' + (error ? '- ' + error : ''),
						error,
					};
				}
				await setStorage('sidePanelData', sidePanelData);

				try {
					port.postMessage({
						content:
							error ??
							`Workflow processed! Open the sidepanel to see the results`,
					});
				} catch (error) {}
			}
			console.groupEnd();
		});
	}

	port.onDisconnect.addListener(() => {
		console.log('Port disconnected');
	});
});