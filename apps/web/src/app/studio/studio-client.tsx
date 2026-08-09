"use client";

import type { WorkflowDocument, WorkflowNodeConfig, WorkflowNodeKind } from "@juicy-guilds/contracts";
import { coreNodeDefinitions } from "@juicy-guilds/studio-engine";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

interface StudioNodeData extends Record<string, unknown> {
  config: WorkflowNodeConfig;
  kind: WorkflowNodeKind;
}

type StudioNode = Node<StudioNodeData, "juicy">;

function WorkflowNodeCard({ data, selected }: NodeProps<StudioNode>) {
  const definition = coreNodeDefinitions.find((item) => item.kind === data.kind);
  const config = data.config as unknown as Record<string, unknown>;
  const summary = String(config.content ?? config.title ?? config.label ?? config.action ?? definition?.description ?? "");
  return (
    <div className={`flow-node flow-node-${definition?.category ?? "content"} ${selected ? "active" : ""}`}>
      <Handle position={Position.Left} type="target" />
      <span>{definition?.label ?? data.kind}</span>
      <small>{summary.slice(0, 64)}</small>
      <Handle position={Position.Right} type="source" />
    </div>
  );
}

const nodeTypes = { juicy: WorkflowNodeCard };

export function StudioClient(props: {
  channels: Array<{ channel_id: string; channel_name: string; parent_name: string | null }>;
  initialChannelId: string;
  initialWorkflow: WorkflowDocument;
  projects: Array<{ id: string; name: string; status: string; updated_at: string }>;
}) {
  return <ReactFlowProvider><StudioWorkspace {...props} /></ReactFlowProvider>;
}

function StudioWorkspace({ channels, initialChannelId, initialWorkflow, projects }: Parameters<typeof StudioClient>[0]) {
  const initialNodes: StudioNode[] = initialWorkflow.nodes.map((node) => ({ id: node.id, type: "juicy", position: node.position, data: { kind: node.kind, config: node.config } }));
  const initialEdges: Edge[] = initialWorkflow.edges.map((edge) => ({ ...edge }));
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = useState<string>();
  const [name, setName] = useState(initialWorkflow.name);
  const [channelId, setChannelId] = useState(initialChannelId);
  const [projectId, setProjectId] = useState(initialWorkflow.id);
  const [status, setStatus] = useState("Pronto");
  const selected = nodes.find((node) => node.id === selectedId);
  const selectedDefinition = coreNodeDefinitions.find((item) => item.kind === selected?.data.kind);
  const onConnect = useCallback((connection: Connection) => setEdges((current) => addEdge({ ...connection, id: crypto.randomUUID() }, current)), [setEdges]);

  const workflow = useMemo<WorkflowDocument>(() => ({
    ...initialWorkflow,
    id: projectId,
    name: name.trim() || "Workflow sem nome",
    updatedAt: new Date().toISOString(),
    nodes: nodes.map((node) => ({ id: node.id, kind: node.data.kind, position: node.position, config: node.data.config })) as WorkflowDocument["nodes"],
    edges: edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, ...(edge.sourceHandle ? { sourceHandle: edge.sourceHandle } : {}) })),
  }), [edges, initialWorkflow, name, nodes, projectId]);

  function addNode(kind: WorkflowNodeKind) {
    const definition = coreNodeDefinitions.find((item) => item.kind === kind);
    if (!definition) return;
    const id = `${kind}-${crypto.randomUUID()}`;
    setNodes((current) => [...current, {
      id,
      type: "juicy",
      position: { x: 100 + (current.length % 3) * 240, y: 80 + Math.floor(current.length / 3) * 150 },
      data: { kind, config: structuredClone(definition.defaultConfig) },
    }]);
    setSelectedId(id);
  }

  function updateConfig(key: string, value: string | string[]) {
    if (!selectedId) return;
    setNodes((current) => current.map((node) => node.id === selectedId
      ? { ...node, data: { ...node.data, config: { ...(node.data.config as unknown as Record<string, unknown>), [key]: value } as WorkflowNodeConfig } }
      : node));
  }

  async function persist(action: "save" | "publish") {
    setStatus(action === "save" ? "Salvando…" : "Publicando…");
    const response = await fetch(`/studio/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, workflow }),
    });
    const result = await response.json() as { errors?: string[]; projectId?: string };
    if (!response.ok) {
      setStatus(result.errors?.join(" · ") ?? "Falha ao salvar");
      return;
    }
    if (result.projectId) {
      setProjectId(result.projectId);
      window.history.replaceState(null, "", `/studio?project=${result.projectId}`);
    }
    setStatus(action === "save" ? "Rascunho salvo" : "Publicado e enviado para a fila");
  }

  return (
    <main className="studio-shell">
      <header className="studio-toolbar">
        <Link href="/dashboard">← Dashboard</Link>
        <input aria-label="Nome do workflow" maxLength={80} onChange={(event) => setName(event.target.value)} value={name} />
        <select aria-label="Canal" onChange={(event) => setChannelId(event.target.value)} value={channelId}>
          {channels.map((channel) => <option key={channel.channel_id} value={channel.channel_id}>{channel.parent_name ? `${channel.parent_name} / ` : "# "}{channel.channel_name}</option>)}
        </select>
        <span className="studio-status">{status}</span>
        <button className="button secondary" onClick={() => void persist("save")} type="button">Salvar</button>
        <button className="button" disabled={!channelId || nodes.length === 0} onClick={() => void persist("publish")} type="button">Publicar</button>
      </header>
      <div className="studio-layout">
        <aside className="studio-sidebar">
          <p className="eyebrow">Biblioteca</p>
          {coreNodeDefinitions.map((definition) => (
            <button key={definition.kind} onClick={() => addNode(definition.kind)} type="button">
              <strong>{definition.label}</strong><small>{definition.description}</small>
            </button>
          ))}
          <p className="eyebrow studio-projects-title">Workflows</p>
          {projects.map((project) => <Link className="project-link" href={`/studio?project=${project.id}`} key={project.id}>{project.name}<small>{project.status}</small></Link>)}
        </aside>
        <section className="studio-canvas">
          <ReactFlow
            deleteKeyCode={["Backspace", "Delete"]}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            nodes={nodes}
            onConnect={onConnect}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onNodesChange={onNodesChange}
          >
            <Background color="#303636" gap={24} variant={BackgroundVariant.Dots} />
            <Controls />
            <MiniMap nodeColor="#536877" />
          </ReactFlow>
        </section>
        <aside className="studio-inspector">
          <p className="eyebrow">Propriedades</p>
          {selected && selectedDefinition ? (
            <>
              <h2>{selectedDefinition.label}</h2>
              {selectedDefinition.fields.map((field) => {
                const config = selected.data.config as unknown as Record<string, unknown>;
                const rawValue = config[field.key];
                const value = field.type === "list" && Array.isArray(rawValue) ? rawValue.join("\n") : String(rawValue ?? "");
                return <label key={field.key}>{field.label}
                  {field.type === "textarea" || field.type === "list" ? (
                    <textarea onChange={(event) => updateConfig(field.key, field.type === "list" ? event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) : event.target.value)} rows={4} value={value} />
                  ) : field.type === "select" ? (
                    <select onChange={(event) => updateConfig(field.key, event.target.value)} value={value}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                  ) : <input onChange={(event) => updateConfig(field.key, event.target.value)} type={field.type} value={value} />}
                </label>;
              })}
            </>
          ) : <p>Selecione um nó para editar.</p>}
        </aside>
      </div>
    </main>
  );
}
