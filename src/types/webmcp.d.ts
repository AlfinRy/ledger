declare global {
  type WebMcpJsonSchema = {
    type: string
    properties?: Record<string, WebMcpJsonSchema>
    required?: string[]
    description?: string
    enum?: string[]
    items?: WebMcpJsonSchema
    minItems?: number
    maxItems?: number
    additionalProperties?: boolean
  }

  type WebMcpTool = {
    name: string
    title?: string
    description: string
    inputSchema?: WebMcpJsonSchema
    annotations?: {
      readOnlyHint?: boolean
      untrustedContentHint?: boolean
    }
    execute: (
      input: Record<string, unknown>,
      options: { signal: AbortSignal },
    ) => unknown | Promise<unknown>
  }

  type WebMcpModelContext = EventTarget & {
    registerTool: (
      tool: WebMcpTool,
      options?: { signal?: AbortSignal; exposedTo?: string[] },
    ) => Promise<void>
  }

  interface Document {
    modelContext?: WebMcpModelContext
  }

  interface Navigator {
    modelContext?: WebMcpModelContext
  }
}

export {}
