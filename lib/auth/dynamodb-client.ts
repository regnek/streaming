import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

// Create a custom DynamoDB client that doesn't try to read from the filesystem
export const createDynamoDBClient = () => {
  return new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    // Disable default credential provider chain completely
    credentialDefaultProvider: () => async () => {
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    },
    // Disable loading config from shared config files
    customUserAgent: "StreamflixApp/1.0",
    maxAttempts: 3,
  })
}

// Create a singleton instance
let dynamoDBClient: DynamoDBClient | null = null

// Get the DynamoDB client instance
export const getDynamoDBClient = () => {
  if (!dynamoDBClient) {
    dynamoDBClient = createDynamoDBClient()
  }
  return dynamoDBClient
}

// Helper functions that don't use document client
export async function getItem(tableName: string, key: Record<string, any>) {
  const client = getDynamoDBClient()

  const command = new GetItemCommand({
    TableName: tableName,
    Key: marshall(key),
  })

  const response = await client.send(command)
  return response.Item ? unmarshall(response.Item) : null
}

export async function putItem(tableName: string, item: Record<string, any>) {
  const client = getDynamoDBClient()

  const command = new PutItemCommand({
    TableName: tableName,
    Item: marshall(item),
  })

  return client.send(command)
}

export async function queryItems(
  tableName: string,
  indexName: string | undefined,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
) {
  const client = getDynamoDBClient()

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
  })

  const response = await client.send(command)
  return response.Items ? response.Items.map((item) => unmarshall(item)) : []
}

export async function updateItem(
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionAttributeValues: Record<string, any>,
) {
  const client = getDynamoDBClient()

  const command = new UpdateItemCommand({
    TableName: tableName,
    Key: marshall(key),
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ReturnValues: "ALL_NEW",
  })

  const response = await client.send(command)
  return response.Attributes ? unmarshall(response.Attributes) : null
}
