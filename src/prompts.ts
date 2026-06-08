export type PromptVars = Record<string, string | number | boolean>;

/**
 * Fill a prompt template by replacing `{{ name }}` placeholders with values.
 *
 * Placeholders are matched case-sensitively and may include surrounding
 * whitespace (e.g. `{{name}}` or `{{ name }}`). A missing variable is treated as
 * a programming error and throws, so prompts never silently ship with holes.
 *
 * @param template - The template string containing `{{ placeholders }}`.
 * @param vars - A map of variable names to values.
 * @returns The interpolated string.
 * @throws If the template references a variable not present in `vars`.
 */
export function buildPrompt(template: string, vars: PromptVars): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(vars, key)) {
      throw new Error(`buildPrompt: missing variable "${key}"`);
    }
    return String(vars[key]);
  });
}
