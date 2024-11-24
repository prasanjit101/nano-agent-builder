export const sendNotification = (
	notificationId: string,
	params: chrome.notifications.NotificationOptions<true>
) => {
	chrome.notifications.create(notificationId, params, function () {
		console.log('Notification sent!');
	});
};



export const setStorage = async (key: string, data: any) => {
	console.log(`saving to storage ${key}`, data);
	return await chrome.storage.local.set({ [key]: JSON.stringify(data) });
};

export const getStorage = async <T = any>(key: string, log: boolean = true) => {
	const a: { [key: string]: string } = await chrome.storage.local.get([key]);
	log && console.log(`retrieved from storage ${key}`, a[key]);
	return JSON.parse(a[key]) as T;
};

export const getCurrentTab = async (options?: chrome.tabs.QueryInfo) => {
	const queryOptions: chrome.tabs.QueryInfo = options ?? {
		lastFocusedWindow: true,
		windowType: 'normal',
		active: true,
	};
	const tabs = await chrome.tabs.query(queryOptions);
	console.log({ tabs });
	const tab = tabs[0];
	return tab;
};

/**
 * Opens the side panel for the given window.
 *
 * If no windowId is given, it defaults to the current window.
 *
 * @param {number} [windowId] The id of the window to open the side panel for.
 * @returns {Promise<void>}
 */
export const openSidePanel = async (windowId?: number) => {
	chrome.sidePanel.open({ windowId: windowId ?? chrome.windows.WINDOW_ID_CURRENT });
};



/**
 * Asks the AI to generate text based on the given input and
 * parameters.
 *
 * This function returns the generated text.
 *
 * @param {string} input The input string to prompt the AI with.
 * @param {{role: 'user' | 'assistant' | 'system', content: string}[]} initialPrompts
 *   The initial prompts to give to the AI, including the role and content of each prompt.
 * @param {{temperature: number, topK: number}} [config]
 *   Additional configuration to give to the AI. `temperature` is a value between 0 and 1 that
 *   determines how random the generated text should be, and `topK` is the number of tokens to
 *   generate.
 * @returns {Promise<string>}
 */
export const invokeAi = async (
	input: string,
	initialPrompts: {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}[],
	config?: {
		temperature: number;
		topK: number;
	}
) => {
	try {
		const aiParams = {
			initialPrompts,
			...(config ?? {}),
		};

		let session = await(chrome as any).aiOriginTrial.languageModel.create(aiParams);
		const r = await session.prompt(input);

		console.log('AI result:', r);
		return r;
	} catch (e) {
		console.log('Prompt failed');
		console.error(e);
		console.log('Prompt:', input);
		throw e;
	}
};