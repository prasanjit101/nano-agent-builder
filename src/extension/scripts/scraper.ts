import { MAX_MODEL_CHARS } from '@/lib/constant';
import { isProbablyReaderable, Readability } from '@mozilla/readability';

function canBeParsed(document: any) {
	return isProbablyReaderable(document);
}

function parse(document: any) {
	if (!canBeParsed(document)) {
		console.log('Document cannot be parsed');
		return 'Page cannot be parsed';
	}
	console.log('Document can be parsed');
	const documentClone = document.cloneNode(true);
	const article = new Readability(documentClone).parse();
	console.log({ article });
	return (
		(article?.title ? `title: ${article?.title}\n\n` : '') +
		article?.textContent
			.replace(/[\n\t\r]/g, '')
			.replace('  ', '')
			.slice(0, MAX_MODEL_CHARS)
	);
}

parse(window.document);
