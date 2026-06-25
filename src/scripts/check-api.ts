const baseUrl = process.env.API_URL ?? 'http://localhost:5000';

const check = async (path: string) => {
  const response = await fetch(`${baseUrl}${path}`);
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  console.log(`GET ${path} -> ${response.status}`);
  console.log(body);
};

const run = async () => {
  await check('/health');
  await check('/');
  await check('/api/products');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
