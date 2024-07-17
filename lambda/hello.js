exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Headers": "*", // Allow all headers
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allow specific methods
      "Content-Type": "text/plain"
    },
    body: `Hello, CDK! You've hit ${event.path}\n`
}; };