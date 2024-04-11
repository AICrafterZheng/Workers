export default async function (request, response) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const model = 'claude-3-haiku-20240307';
  const maxTokens = 1024;

  const userMessage = await getUserInput(request);

  const requestData = {
    model: model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userMessage }],
  };

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!anthropicResponse.ok) {
    throw new Error(`API request failed with status ${anthropicResponse.status}`);
  }

  const responseData = await anthropicResponse.json();
  console.log('Response:', responseData);

  response.status(200).json(responseData);
}

async function getUserInput(request) {
  const { searchParams } = new URL(request.url);
  const userMessage = searchParams.get('message') || '';
  return userMessage;
}