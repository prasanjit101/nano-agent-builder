// The underlying model has a context of 1,024 tokens, out of which 26 are used by the internal prompt,
// leaving about 998 tokens for the input text. Each token corresponds, roughly, to about 4 characters, so 4,000
// is used as a limit to warn the user the content might be too long to summarize.
export const MAX_MODEL_CHARS = 3500;// using 3500, considering the internal and other prompts
// export const MAX_MODEL_CHARS = 4000;
