// Library of functions to interact with the RDT API and Jupyter

export interface TestResponse {
  text: string;
}

/**
 * Sends the RDT text to the Spring Boot API.
 *
 * @returns A promise that resolves when the request completes.
 */
export const sendRdtTextToSpring = async (): Promise<void> => {
  // function finishes in the future and does not return a value
  const res = await fetch('http://localhost:8080/write', {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain' },
    body: 'Sent from react trought rtd API to DTaaS',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
};
/**
 * Fetch text from  RDT API
 *
 * @returns text .
 */
export const fetchRdtText = async (
  apiUrl: string = 'http://localhost:8080/test',
): Promise<TestResponse> => {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`API HTTP ${response.status}: ${await response.text()}`);
  }
  const text = await response.text();
  return { text };
};
/**
 * Send text to Jupyter as a file  (Testing purpose - Use the Spring Boot shared folder instead)
 *
 * @returns text .
 */
export const sendTextToJupyter = async (
  text: string,
  filename: string = 'output.txt',
  jupyterBasePath: string = '/h598077',
) => {
  if (!text) {
    throw new Error('No text content provided');
  }

  const url = `${jupyterBasePath}/api/contents/${encodeURIComponent(filename)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'file',
      format: 'text',
      content: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jupyter HTTP ${res.status}: ${body}`);
  }
};
