import { AgentActionDefinition } from "@/types/agent/actions/types";
import { z } from "zod";

export type CtrlAgentRole = "system" | "user" | "assistant" | "tool";

export type CtrlAgentTextPart = {
  type: "text";
  text: string;
};

export type CtrlAgentImagePart = {
  type: "image";
  /** data URL or remote URL */
  url: string;
  /** optional mime type when using data URLs */
  mimeType?: string;
};

export type CtrlAgentToolPart = {
  type: "tool_call";
  toolName: string;
  arguments: unknown;
};

export type CtrlAgentContentPart =
  | CtrlAgentTextPart
  | CtrlAgentImagePart
  | CtrlAgentToolPart;

export type CtrlAgentMessage =
  | {
      role: Extract<CtrlAgentRole, "system" | "user">;
      content: string | CtrlAgentContentPart[];
    }
  | {
      role: Extract<CtrlAgentRole, "assistant">;
      content: string | CtrlAgentContentPart[];
      toolCalls?: Array<{ id?: string; name: string; arguments: unknown }>;
    }
  | {
      role: "tool";
      toolName: string;
      toolCallId?: string;
      content: string | CtrlAgentContentPart[];
    };

export type CtrlAgentCapabilities = {
  multimodal: boolean;
  toolCalling: boolean;
  jsonMode: boolean;
};

export type CtrlAgentInvokeOptions = {
  temperature?: number;
  maxTokens?: number;
  /** provider specific; passed through unmodified */
  providerOptions?: Record<string, unknown>;
};

export type StructuredOutputRequest<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  /** hints to providers */
  hints?: {
    forceJson?: boolean;
    toolName?: string;
  };
  options?: CtrlAgentInvokeOptions;
  actions?: AgentActionDefinition[];
};

export type CtrlAgentStructuredResult<TSchema extends z.ZodTypeAny> = {
  rawText: string;
  parsed: z.infer<TSchema> | null;
};

export interface CtrlAgentLLM {
  invoke(
    messages: CtrlAgentMessage[],
    options?: CtrlAgentInvokeOptions
  ): Promise<{
    role: "assistant";
    content: string | CtrlAgentContentPart[];
    toolCalls?: Array<{ id?: string; name: string; arguments: unknown }>;
    usage?: { inputTokens?: number; outputTokens?: number };
  }>;

  invokeStructured<TSchema extends z.ZodTypeAny>(
    request: StructuredOutputRequest<TSchema>,
    messages: CtrlAgentMessage[]
  ): Promise<CtrlAgentStructuredResult<TSchema>>;

  getProviderId(): string;
  getModelId(): string;
  getCapabilities(): CtrlAgentCapabilities;
}
