import type { NodeDefinition } from "@juicy-guilds/studio-engine";

export interface StudioPaletteItem {
  kind: NodeDefinition["kind"];
  label: string;
  category: NodeDefinition["category"];
}

export function toPaletteItem(definition: NodeDefinition): StudioPaletteItem {
  return {
    kind: definition.kind,
    label: definition.label,
    category: definition.category,
  };
}
