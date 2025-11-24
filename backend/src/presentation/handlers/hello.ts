import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': allowedOrigin !== "*" ? "true" : "false",
    },
    body: JSON.stringify({
      message: 'Hello from Lovy API!',
      timestamp: new Date().toISOString(),
      path: event.path,
      stage: process.env.STAGE,
      allowedOrigin: allowedOrigin,
    }),
  };
};
